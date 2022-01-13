import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { account, DEFAULT_WSOL, utils } from '@senswap/sen-js'
import { useWallet } from '@senhub/providers'

import { Row, Col, Typography, Button, Space } from 'antd'
import Selection from '../selection'
import NumericInput from 'shared/antd/numericInput'
import { MintSymbol } from 'shared/antd/mint'
import WormholeSupported from './wormholeSupported'

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

const Bid = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    wallet: { address: walletAddress, lamports },
  } = useWallet()
  const {
    bid: { amount: bidAmount, accountAddress, mintInfo, poolAddresses },
    ask: {
      mintInfo: { address: askAddress },
    },
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
  const onAmount = (val: string) =>
    dispatch(updateBidData({ amount: val, prioritized: true }))
  // All in :)))
  const onMax = () => onAmount(maxBalance)

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
    <Row gutter={[8, 8]}>
      <Col flex="auto">
        <Typography.Text>From</Typography.Text>
      </Col>
      <Col>
        <WormholeSupported />
      </Col>
      <Col span={24}>
        <NumericInput
          placeholder="0"
          value={bidAmount}
          onValue={onAmount}
          size="large"
          prefix={
            <Selection
              hiddenTokens={[askAddress]}
              value={selectionInfo}
              onChange={onSelectionInfo}
            />
          }
          suffix={
            <Button
              type="text"
              size="small"
              style={{ fontSize: 12, marginRight: -7 }}
              onClick={onMax}
            >
              MAX
            </Button>
          }
        />
      </Col>
      <Col flex="auto" />
      <Col>
        <Space className="caption">
          <Typography.Text type="secondary">Available:</Typography.Text>
          <Typography.Text type="secondary">
            {numeric(maxBalance || 0).format('0,0.[00]')}
          </Typography.Text>
          <Typography.Text type="secondary">
            <MintSymbol mintAddress={selectionInfo.mintInfo?.address || ''} />
          </Typography.Text>
        </Space>
      </Col>
    </Row>
  )
}

export default Bid
