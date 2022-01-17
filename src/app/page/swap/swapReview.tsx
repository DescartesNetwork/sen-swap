import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Card, Col, Row, Typography } from 'antd'
import SwapAction from 'app/components/swapAction'
import Preview from 'app/components/preview'

import { updateBidData } from 'app/model/bid.controller'
import { PriceImpact } from 'app/constant/swap'
import ConfirmSwap from 'app/components/confirmSwap'
import { AppState } from 'app/model'

const SwapActions = () => {
  const [visivle, setVisivle] = useState(false)
  const dispatch = useDispatch()
  const {
    route: { priceImpact },
  } = useSelector((state: AppState) => state)

  const onCallback = () =>
    dispatch(updateBidData({ amount: '', prioritized: true }))

  const tooHighImpact = priceImpact > PriceImpact.acceptableSwap

  return (
    <Card bordered={false}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Typography.Title level={5}>Review & Swap</Typography.Title>
        </Col>
        <Col span={24}>
          <Preview />
        </Col>
        <Col span={24} /> {/* Safe sapce */}
        <Col span={24}>
          {tooHighImpact ? (
            <Button type="primary" onClick={() => setVisivle(true)} block>
              Review & Swap
            </Button>
          ) : (
            <SwapAction onCallback={onCallback} />
          )}
        </Col>
        {tooHighImpact && (
          <ConfirmSwap visible={visivle} onCancel={setVisivle} />
        )}
      </Row>
    </Card>
  )
}

export default SwapActions
