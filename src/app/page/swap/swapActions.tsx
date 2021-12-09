import { DEFAULT_WSOL, utils } from '@senswap/sen-js'
import { Card, Col, Row, Typography } from 'antd'
import SwapButton from 'app/components/swapButton'
import SwapInfo from 'app/components/preview'
import { AppState } from 'app/model'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useAccount } from 'senhub/providers'

const SwapActions = () => {
  const { route } = useSelector((state: AppState) => state.route)
  const bidData = useSelector((state: AppState) => state.bid)
  const askData = useSelector((state: AppState) => state.ask)
  const { accounts } = useAccount()

  const wrapAmount = useMemo(() => {
    const bidMint = bidData.mintInfo
    const bidAccount = accounts[bidData.accountAddress]
    const bidBalance = bidAccount?.amount || BigInt(0)

    if (!bidMint || !Number(bidData.amount)) return BigInt(0)
    if (bidMint.address !== DEFAULT_WSOL) return BigInt(0)

    const bidAmount = utils.decimalize(bidData.amount, bidMint.decimals)
    if (bidAmount <= bidBalance) return BigInt(0)

    return bidAmount - bidBalance
  }, [accounts, bidData.accountAddress, bidData.amount, bidData.mintInfo])

  const disabled =
    !route?.hops.length ||
    !parseFloat(bidData.amount) ||
    parseFloat(bidData.amount) < 0 ||
    !parseFloat(askData?.amount) ||
    parseFloat(askData?.amount) < 0

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
          <SwapButton
            hops={route?.hops || []}
            wrapAmount={wrapAmount}
            disabled={disabled}
          />
        </Col>
      </Row>
    </Card>
  )
}

export default SwapActions
