import { useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { account, DEFAULT_WSOL, utils } from '@senswap/sen-js'
import { useWallet } from '@senhub/providers'

import { Row, Col, Typography, Space, Slider } from 'antd'
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

const MARKS = {
  0: '0%',
  25: '25%',
  50: '50%',
  75: '75%',
  100: '100%',
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
    (val: string) =>
      dispatch(updateBidData({ amount: val, prioritized: true })),
    [dispatch],
  )
  // All in :)))
  const onMax = () => onAmount(maxBalance)
  // set percent balance
  const onSetPercentBalance = useCallback(
    (value: number) => {
      if (!maxBalance) return
      const numMaxBalance = Number(maxBalance)
      if (numMaxBalance < 0.5) return onAmount(maxBalance)
      const percentageBalance = (numMaxBalance * value) / 100
      return onAmount(`${percentageBalance}`)
    },
    [maxBalance, onAmount],
  )

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

  return (
    <Row gutter={[0, 0]} align="middle">
      <Col flex="auto">
        <Selection value={selectionInfo} onChange={onSelectionInfo} />
      </Col>
      <Col>
        <NumericInput
          bordered={false}
          style={{ textAlign: 'right', fontSize: 24, maxWidth: 180 }}
          placeholder="0"
          value={bidAmount}
          onValue={onAmount}
        />
      </Col>
      <Col span={24}>
        <Row>
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
            <Slider
              className="bid-slide"
              marks={MARKS}
              step={null}
              onChange={onSetPercentBalance}
            />
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default Bid
