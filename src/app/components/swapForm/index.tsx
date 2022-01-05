import { Col, Row } from 'antd'
import Settings from '../settings'
import SwapInput from './swapInput'

const SwapForm = () => {
  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Row gutter={[8, 8]} justify="end" align="middle" wrap={false}>
          <Col>
            <Settings />
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <SwapInput />
      </Col>
    </Row>
  )
}

export default SwapForm
