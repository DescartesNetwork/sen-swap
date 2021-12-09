import { Row, Col, Typography, Switch } from 'antd'
import IonIcon from 'shared/ionicon'

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
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              Advanced Mode
            </Typography.Text>
          </Col>
          <Col>
            <Switch
              size="small"
              checkedChildren={<IonIcon name="calculator-outline" />}
              unCheckedChildren={<IonIcon name="sparkles-outline" />}
              checked={value}
              onChange={onChange}
            />
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <Typography.Paragraph style={{ fontSize: 12, textAlign: 'justify' }}>
          <IonIcon name="warning-outline" /> This advanced mode will disable the
          automatic optimization that often results in bad rates and lost funds.
          Only use this mode if you know what you are doing.{' '}
          <strong style={{ color: '#f9575e' }}>
            The advanced mode will display in the token list.
          </strong>
        </Typography.Paragraph>
      </Col>
    </Row>
  )
}

export default Advanced
