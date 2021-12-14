import { Row, Col, Space, Avatar, Typography, Card, Divider } from 'antd'
import IonIcon from 'shared/antd/ionicon'

const Mint = ({
  logoURI,
  symbol,
  name,
  onClick,
  active = false,
}: {
  logoURI: string | undefined
  symbol: string
  name: string
  onClick: () => void
  active?: boolean
}) => {
  return (
    <Card
      className={`card-child${active ? ' active' : ''}`}
      bodyStyle={{ padding: `8px 16px`, cursor: 'pointer' }}
      bordered={active}
      onClick={onClick}
      hoverable
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Space size={12} style={{ marginLeft: -4 }}>
            <Avatar
              src={logoURI}
              size={32}
              style={{ backgroundColor: '#2D3355', border: 'none' }}
            >
              <IonIcon name="diamond-outline" />
            </Avatar>
            <Typography.Text style={{ margin: 0 }}>{symbol}</Typography.Text>
            <Divider type="vertical" style={{ margin: 0 }} />
            <Typography.Text
              type="secondary"
              style={{ margin: 0, fontSize: 12 }}
            >
              {name}
            </Typography.Text>
          </Space>
        </Col>
      </Row>
    </Card>
  )
}

export default Mint
