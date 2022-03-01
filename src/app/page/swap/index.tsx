import { useSelector } from 'react-redux'

import { Card, Col, Row } from 'antd'
import SwapReview from './swapReview'
import PoolInfo from './poolInfo'
import SwapForm from 'app/components/swapForm'
import { AppState } from 'app/model'

const Swap = () => {
  const { enhancement } = useSelector((state: AppState) => state.settings)
  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Card bordered={false} className="card-swap">
          <SwapForm />
        </Card>
      </Col>
      <Col span={24}>
        <SwapReview />
      </Col>
      {enhancement && (
        <Col span={24}>
          <PoolInfo />
        </Col>
      )}
    </Row>
  )
}

export default Swap
