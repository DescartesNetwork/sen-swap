import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { DEFAULT_WSOL, utils } from '@senswap/sen-js'

import { Card, Col, Row, Typography } from 'antd'
import SwapButton from 'app/components/swapButton'
import SwapInfo from 'app/components/preview'

import { AppState } from 'app/model'
import { useAccount } from 'senhub/providers'

const SwapActions = () => {
  const { route } = useSelector((state: AppState) => state.route)
  const {
    amount: bidAmount,
    mintInfo: bidMint,
    accountAddress: bidAccountAddr,
  } = useSelector((state: AppState) => state.bid)
  const { amount: askAmount } = useSelector((state: AppState) => state.ask)
  const { accounts } = useAccount()

  const hops = route?.hops || []

  const wrapAmount = useMemo(() => {
    const { amount: bidAccountAmount } = accounts[bidAccountAddr] || {}
    const bidBalance = bidAccountAmount || BigInt(0)
    if (!bidMint || !Number(bidAmount) || bidMint.address !== DEFAULT_WSOL)
      return BigInt(0)
    const bid = utils.decimalize(bidAmount, bidMint.decimals)
    if (bid <= bidBalance) return BigInt(0)
    return bid - bidBalance
  }, [accounts, bidAccountAddr, bidAmount, bidMint])

  const disabled =
    !hops.length ||
    !parseFloat(bidAmount) ||
    parseFloat(bidAmount) < 0 ||
    !parseFloat(askAmount) ||
    parseFloat(askAmount) < 0

  return (
    <Card bordered={false}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Typography.Title level={5}>Review & Swap</Typography.Title>
        </Col>
        <Col span={24}>
          <SwapInfo />
        </Col>
        <Col span={24}>
          <SwapButton hops={hops} wrapAmount={wrapAmount} disabled={disabled} />
        </Col>
      </Row>
    </Card>
  )
}

export default SwapActions
