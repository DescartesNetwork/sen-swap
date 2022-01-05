import { useDispatch } from 'react-redux'

import { Card, Col, Row, Typography } from 'antd'
import SwapAction from 'app/components/swapAction'
import Preview from 'app/components/preview'

import { updateBidData } from 'app/model/bid.controller'

const SwapActions = () => {
  const dispatch = useDispatch()
  const onCallback = () =>
    dispatch(updateBidData({ amount: '', prioritized: true }))

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
          <SwapAction onCallback={onCallback} />
        </Col>
      </Row>
    </Card>
  )
}

export default SwapActions
