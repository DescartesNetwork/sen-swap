import { Col, Empty, Row } from 'antd'

const ChartEmpty = () => {
  return (
    <Row style={{ height: 170 }} align="middle" justify="center">
      <Col>
        <Empty />
      </Col>
    </Row>
  )
}

export default ChartEmpty
