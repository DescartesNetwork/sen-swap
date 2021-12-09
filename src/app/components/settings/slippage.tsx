import { Row, Col, Button, Typography, Tooltip } from 'antd'
import IonIcon from 'shared/ionicon'

const Option = ({
  label,
  value,
  onClick,
  active = false,
}: {
  label: string
  value: number
  onClick: (value: number) => void
  active?: boolean
}) => {
  return (
    <Typography.Text
      style={{ cursor: 'pointer', color: active ? '#F9575E' : 'inherit' }}
      onClick={() => onClick(value)}
    >
      {label}
    </Typography.Text>
  )
}

const Slippage = ({
  value,
  onChange,
}: {
  value: number
  onChange: (value: number) => void
}) => {
  return (
    <Row gutter={[8, 8]}>
      <Col span={24}>
        <Row gutter={[8, 8]} wrap={false}>
          <Col flex="auto">
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              Slippage Tolerance
            </Typography.Text>
          </Col>
          <Col>
            <Tooltip
              placement="right"
              title={
                <span>
                  Your transaction will be canceled if the confirmed price
                  breaks the limited range of{' '}
                  <strong style={{ color: '#f9575e' }}>{`${
                    value * 100
                  }%.`}</strong>
                </span>
              }
            >
              <Button
                type="text"
                shape="circle"
                size="small"
                icon={<IonIcon name="information-circle-outline" />}
              />
            </Tooltip>
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <Row gutter={[8, 8]} wrap={false} justify="space-between">
          {[0.001, 0.005, 0.01, 0.05, 1].map((e, i) => (
            <Col key={i}>
              <Option
                label={e === 1 ? 'Freely' : `${e * 100}%`}
                value={e}
                onClick={onChange}
                active={e === value}
              />
            </Col>
          ))}
        </Row>
      </Col>
    </Row>
  )
}

export default Slippage
