import { Col, Row } from 'antd'
import SwapSettings from 'app/page/swap/swapSettings'
import SwapAction from './swapAction'

const Swap = () => {
  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Row gutter={[8, 8]} justify="end" align="middle" wrap={false}>
          <Col>
            <SwapSettings />
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <SwapAction />
      </Col>
    </Row>
  )
}

export default Swap
