import { Row, Col, Space, Typography, Card, Divider } from 'antd'
import { MintAvatar, MintName, MintSymbol } from '@sen-use/components'

const Mint = ({
  mintAddress,
  onClick,
  active = false,
}: {
  mintAddress: string
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
            <MintAvatar mintAddress={mintAddress} size={32} />
            <Typography.Text style={{ margin: 0 }}>
              <MintSymbol mintAddress={mintAddress} />
            </Typography.Text>
            <Divider type="vertical" style={{ margin: 0 }} />
            <Typography.Text
              type="secondary"
              style={{ margin: 0, fontSize: 12 }}
            >
              <MintName mintAddress={mintAddress} />
            </Typography.Text>
          </Space>
        </Col>
      </Row>
    </Card>
  )
}

export default Mint
