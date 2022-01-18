import { Card, Col, Row } from 'antd'
import SwapReview from './swapReview'
import PoolInfo from './poolInfo'
import SwapForm from 'app/components/swapForm'

const Swap = () => {
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
      <Col span={24}>
        <PoolInfo />
      </Col>
    </Row>
  )
}

export default Swap
