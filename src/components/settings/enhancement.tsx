import { Col, Row, Switch, Typography } from 'antd'

const Enhancement = ({
  value,
  onChange,
}: {
  value: boolean
  onChange: (value: boolean) => void
}) => {
  return (
    <Row gutter={[8, 8]}>
      <Col span={24}>
        <Row gutter={[8, 8]} wrap={false}>
          <Col flex="auto">
            <Typography.Text>Enhancement UI</Typography.Text>
          </Col>
          <Col>
            <Switch size="small" checked={value} onChange={onChange} />
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <Typography.Paragraph className="caption">
          Take advantage of all the familiar tools.
        </Typography.Paragraph>
      </Col>
    </Row>
  )
}

export default Enhancement
