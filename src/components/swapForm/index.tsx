import { Col, Row } from 'antd'
import WormholeSupported from '../bid/wormholeSupported'
import Settings from '../settings'
import SwapInput from './swapInput'

const SwapForm = () => {
  return (
    <Row gutter={0}>
      <Col span={24} className="swap-setting">
        <Row>
          <Col flex="auto">
            <WormholeSupported />
          </Col>
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
