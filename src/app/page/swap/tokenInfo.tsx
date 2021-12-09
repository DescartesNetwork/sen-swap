import { Card, Col, Row, Space, Typography } from 'antd'
import { MintAvatar } from 'app/shared/components/mint'

const TokenInfo = () => {
  return (
    <Card bordered={false}>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Space direction="vertical" size={4}>
            <MintAvatar mintAddress={''} />
            <Space>
              <Typography.Text>TVL:</Typography.Text>
              <Typography.Title level={5}>18.5 SOL</Typography.Title>
            </Space>
            <Typography.Text className="caption" type="secondary">
              ~ $1000
            </Typography.Text>
          </Space>
        </Col>
        <Col span={12}>
          <Space direction="vertical" size={4}>
            <MintAvatar mintAddress={''} />
            <Space>
              <Typography.Text>TVL:</Typography.Text>
              <Typography.Title level={5}>18.5 SOL</Typography.Title>
            </Space>
            <Typography.Text className="caption" type="secondary">
              ~ $1000
            </Typography.Text>
          </Space>
        </Col>
      </Row>
    </Card>
  )
}

export default TokenInfo
