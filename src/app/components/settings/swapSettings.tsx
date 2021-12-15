import { Col, Divider, Row } from 'antd'
import PoweredBy from 'app/components/poweredBy'
import Settings from 'app/components/settings'

const SwapSettings = () => {
  return (
    <Row gutter={[4, 4]} justify="end" align="middle">
      <Col>
        <PoweredBy />
      </Col>
      <Col>
        <Divider type="vertical" style={{ padding: 0 }} />
      </Col>
      <Col>
        <Settings />
      </Col>
    </Row>
  )
}

export default SwapSettings