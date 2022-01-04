import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DEFAULT_WSOL, utils } from '@senswap/sen-js'

import { Card, Col, Row, Typography } from 'antd'
import SwapButton from 'app/components/swapButton'
import SwapInfo from 'app/components/preview'

import { AppState } from 'app/model'
import usePriceImpact from 'app/hooks/usePriceImpact'
import { updateBidData } from 'app/model/bid.controller'
import useBalance from 'app/hooks/useBalance'

const SwapActions = () => {
  const dispatch = useDispatch()
  const {
    route: { hops },
    bid: {
      amount: bidAmount,
      mintInfo: bidMintInfo,
      accountAddress: bidAccountAddress,
    },
  } = useSelector((state: AppState) => state)
  const { amount: askAmount } = useSelector((state: AppState) => state.ask)
  const { advanced } = useSelector((state: AppState) => state.settings)
  const priceImpact = usePriceImpact()
  const bidBalance = useBalance(bidAccountAddress)

  const wrapAmount = useMemo(() => {
    if (!Number(bidAmount) || bidMintInfo.address !== DEFAULT_WSOL)
      return BigInt(0)
    const amount = utils.decimalize(bidAmount, bidMintInfo.decimals)
    if (amount <= bidBalance) return BigInt(0)
    return amount - bidBalance
  }, [bidBalance, bidAmount, bidMintInfo])

  const tooHightImpact = !advanced && priceImpact * 100 > 12.5 //just swap when the slippage rate is smaller than 12.5%
  const disabled =
    tooHightImpact ||
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
        <Col span={24} /> {/* Safe sapce */}
        <Col span={24}>
          <SwapButton
            hops={hops}
            wrapAmount={wrapAmount}
            disabled={disabled}
            hightImpact={tooHightImpact}
            onCallback={() =>
              dispatch(updateBidData({ amount: '', prioritized: true }))
            }
          />
        </Col>
      </Row>
    </Card>
  )
}

export default SwapActions
