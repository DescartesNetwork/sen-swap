import { Row, Col, Typography, Switch } from 'antd'
import IonIcon from 'shared/antd/ionicon'

const Advanced = ({
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
            <Typography.Text>Advanced Mode</Typography.Text>
          </Col>
          <Col>
            <Switch size="small" checked={value} onChange={onChange} />
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <Typography.Paragraph className="caption">
          <IonIcon name="warning-outline" /> This advanced mode will disable the
          automatic protection that often results in bad rates and lost funds.
          Only use this mode if you know what you are doing.
        </Typography.Paragraph>
      </Col>
    </Row>
  )
}

export default Advanced
