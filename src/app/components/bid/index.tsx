import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { account, DEFAULT_WSOL, utils } from '@senswap/sen-js'
import { useWallet } from '@senhub/providers'

import { Row, Col, Typography, Space, Radio } from 'antd'
import Selection from '../selection'
import NumericInput from 'shared/antd/numericInput'
import { MintSymbol } from 'shared/antd/mint'

import configs from 'app/configs'
import { numeric } from 'shared/util'
import { AppDispatch, AppState } from 'app/model'
import { updateBidData } from 'app/model/bid.controller'
import { SelectionInfo } from '../selection/mintSelection'
import { useMintSelection } from 'app/hooks/useMintSelection'
import { SenLpState } from 'app/constant/senLpState'
import useAccountBalance from 'shared/hooks/useAccountBalance'

const {
  swap: { bidDefault },
} = configs

export enum RATE {
  FIFTY = 50,
  HUNDRED = 100,
}

const Bid = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    wallet: { address: walletAddress, lamports },
  } = useWallet()
  const {
    bid: { amount: bidAmount, accountAddress, mintInfo, poolAddresses },
  } = useSelector((state: AppState) => state)
  const { amount: balance } = useAccountBalance(accountAddress)
  const selectionDefault = useMintSelection(bidDefault)
  const { state } = useLocation<SenLpState>()
  const poolAdress = state?.poolAddress
  const { address: mintAddress, decimals } = mintInfo
  const [activeValue, setActiveValue] = useState(0)

  // Select default
  useEffect(() => {
    if (account.isAddress(accountAddress) || account.isAddress(poolAdress))
      return
    dispatch(updateBidData(selectionDefault))
  }, [accountAddress, dispatch, poolAdress, selectionDefault])

  // Compute selection info
  const selectionInfo: SelectionInfo = useMemo(
    () => ({ mintInfo, poolAddresses }),
    [mintInfo, poolAddresses],
  )

  const fiftyPerBtn = useMemo(() => {
    if (activeValue === RATE.HUNDRED) return RATE.HUNDRED
    return RATE.FIFTY
  }, [activeValue])

  // Compute human-readable balance
  const maxBalance = useMemo((): string => {
    if (mintAddress !== DEFAULT_WSOL)
      return utils.undecimalize(balance, decimals)
    // So estimate max = 0.01 fee -> multi transaction.
    const estimateFee = utils.decimalize(0.01, decimals)
    const max = lamports + balance - estimateFee
    if (max <= balance) return utils.undecimalize(balance, decimals)
    return utils.undecimalize(max, decimals)
  }, [balance, decimals, lamports, mintAddress])

  // Handle amount
  const onAmount = useCallback(
    (val: string) => {
      return dispatch(updateBidData({ amount: val, prioritized: true }))
    },

    [dispatch],
  )
  // All in :)))
  const onMax = () => onAmount(maxBalance)
  // set percent balance
  const onChangePercentAmount = useCallback(
    (activeValue: RATE) => {
      if (!maxBalance) return
      const numMaxBalance = Number(maxBalance)
      if (numMaxBalance < 5 / 10 ** 6) return onAmount(maxBalance)
      const percentageBalance = numMaxBalance * (activeValue / 100)
      return onAmount(`${percentageBalance}`)
    },
    [maxBalance, onAmount],
  )

  const checkActive = useCallback(() => {
    const numMaxBalance = Number(maxBalance)
    const amount = Number(bidAmount)
    if (!numMaxBalance || numMaxBalance === 0) return setActiveValue(0)
    if (numMaxBalance === amount) return setActiveValue(RATE.HUNDRED)
    if (numMaxBalance / 2 === amount) return setActiveValue(RATE.FIFTY)
    return setActiveValue(0)
  }, [bidAmount, maxBalance])

  // Update bid data
  const onSelectionInfo = async (selectionInfo: SelectionInfo) => {
    const { splt } = window.sentre
    const { address: mintAddress } = selectionInfo.mintInfo || {}
    if (!account.isAddress(mintAddress))
      return dispatch(
        updateBidData({ amount: '', prioritized: true, ...selectionInfo }),
      )
    const accountAddress = await splt.deriveAssociatedAddress(
      walletAddress,
      mintAddress,
    )
    return dispatch(
      updateBidData({
        amount: '',
        prioritized: true,
        accountAddress,
        ...selectionInfo,
      }),
    )
  }

  useEffect(() => {
    checkActive()
  }, [checkActive])

  return (
    <Row gutter={[0, 0]} align="middle">
      <Col flex="auto">
        <Selection value={selectionInfo} onChange={onSelectionInfo} />
      </Col>
      <Col>
        <NumericInput
          bordered={false}
          style={{ textAlign: 'right', fontSize: 24, maxWidth: 200 }}
          placeholder="0"
          value={bidAmount}
          onValue={onAmount}
        />
      </Col>
      <Col span={24}>
        <Row align="middle">
          <Col flex="auto">
            <Space className="caption">
              <Typography.Text type="secondary">Available:</Typography.Text>
              <Typography.Text
                type="secondary"
                style={{ cursor: 'pointer' }}
                onClick={onMax}
              >
                {numeric(maxBalance || 0).format('0,0.[00]')}
              </Typography.Text>
              <Typography.Text type="secondary">
                <MintSymbol
                  mintAddress={selectionInfo.mintInfo?.address || ''}
                />
              </Typography.Text>
            </Space>
          </Col>
          <Col>
            <Space size={0} direction="vertical">
              <Radio.Group value={activeValue} buttonStyle="solid">
                <Space>
                  <Radio.Button
                    className="rate-btn"
                    onClick={() => onChangePercentAmount(RATE.FIFTY)}
                    value={fiftyPerBtn}
                  />
                  <Radio.Button
                    className="rate-btn"
                    onClick={() => onChangePercentAmount(RATE.HUNDRED)}
                    value={RATE.HUNDRED}
                  />
                </Space>
              </Radio.Group>
              <Space>
                <Typography.Text type="secondary">
                  {RATE.FIFTY}%
                </Typography.Text>
                <Typography.Text type="secondary">
                  {RATE.HUNDRED}%
                </Typography.Text>
              </Space>
            </Space>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default Bid
