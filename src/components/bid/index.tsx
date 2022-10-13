import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

import { DEFAULT_WSOL, utils } from '@senswap/sen-js'
import {
  useGetMintDecimals,
  useTheme,
  useWalletAddress,
  useWalletBalance,
  splt,
} from '@sentre/senhub'
import { util } from '@sentre/senhub'

import { Row, Col, Typography, Space, Radio, InputNumber } from 'antd'
import { MintSelection, MintSymbol } from '@sen-use/app'

import { AppDispatch, AppState } from 'model'
import { updateBidData } from 'model/bid.controller'
import { SelectionInfo } from '../selection/mintSelection'
import { useMintSelection } from 'hooks/useMintSelection'
import { SenLpState } from 'constant/senLpState'
import useAccountBalance from 'shared/hooks/useAccountBalance'
import { setLoadingSenSwap } from 'model/route.controller'
import { usePool } from 'hooks/usePool'

import configs from 'configs'

const {
  swap: { bidDefault },
} = configs

export enum RATE {
  FIFTY = 50,
  HUNDRED = 100,
}

const Bid = () => {
  const dispatch = useDispatch<AppDispatch>()
  const walletAddress = useWalletAddress()
  const lamports = useWalletBalance()
  const { pools } = usePool()
  const getDecimals = useGetMintDecimals()
  const theme = useTheme()

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
    if (util.isAddress(accountAddress) || util.isAddress(poolAdress)) return
    dispatch(setLoadingSenSwap({ loadingSenswap: true }))
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
    const max = BigInt(lamports) + balance - estimateFee
    if (max <= balance) return utils.undecimalize(balance, decimals)
    return utils.undecimalize(max, decimals)
  }, [balance, decimals, lamports, mintAddress])

  // Handle amount
  const onAmount = useCallback(
    (val: string) => {
      dispatch(setLoadingSenSwap({ loadingSenswap: true }))
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

  // Compute available pools
  const getAvailablePoolAddresses = useCallback(
    (mintAddress: string) => {
      if (!util.isAddress(mintAddress)) return []
      return Object.keys(pools).filter((poolAddress) => {
        const { mint_a, mint_b } = pools[poolAddress]
        return [mint_a, mint_b].includes(mintAddress)
      })
    },
    [pools],
  )

  // Update bid data
  const onSelectionInfo = async (mintAddress: string) => {
    const poolAddresses = getAvailablePoolAddresses(mintAddress)
    const decimals = (await getDecimals({ mintAddress })) || 0

    const selectionInfo: SelectionInfo = {
      mintInfo: {
        address: mintAddress,
        decimals,
      },
      poolAddresses,
    }

    dispatch(setLoadingSenSwap({ loadingSenswap: true }))
    if (!util.isAddress(mintAddress))
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

  const DARK_BOX_SHADOW = '0px 4px 44px rgba(0, 0, 0, 0.42)'
  const LIGHT_BOX_SHADOW = '0px 4px 40px rgba(33, 36, 51, 0.18)'

  const MINT_SELECTION_STYLE = {
    marginLeft: -7,
    padding: '3px 8px',
    borderRadius: 8,
    cursor: 'pointer',
    boxShadow: theme === 'dark' ? DARK_BOX_SHADOW : LIGHT_BOX_SHADOW,
  }

  return (
    <Row gutter={[0, 0]} align="middle">
      <Col>
        <MintSelection
          value={mintAddress}
          onChange={onSelectionInfo}
          style={MINT_SELECTION_STYLE}
        />
      </Col>
      <Col flex="1">
        <InputNumber
          bordered={false}
          className="amount-input"
          placeholder="0"
          value={bidAmount}
          onChange={onAmount}
          controls={false}
          min="0"
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
                {util.numeric(maxBalance || 0).format('0,0.[00]')}
              </Typography.Text>
              <Typography.Text type="secondary">
                <MintSymbol
                  mintAddress={selectionInfo.mintInfo?.address || ''}
                />
              </Typography.Text>
            </Space>
          </Col>
          <Col>
            <Radio.Group value={activeValue} buttonStyle="solid">
              <Space>
                <Space size={4} direction="vertical">
                  <Radio.Button
                    className="rate-btn"
                    onClick={() => onChangePercentAmount(RATE.FIFTY)}
                    value={fiftyPerBtn}
                  />
                  <Typography.Text type="secondary" className="caption">
                    {RATE.FIFTY}%
                  </Typography.Text>
                </Space>
                <Space size={4} direction="vertical">
                  <Radio.Button
                    className="rate-btn"
                    onClick={() => onChangePercentAmount(RATE.HUNDRED)}
                    value={RATE.HUNDRED}
                  />
                  <Typography.Text type="secondary" className="caption">
                    {RATE.HUNDRED}%
                  </Typography.Text>
                </Space>
              </Space>
            </Radio.Group>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default Bid
