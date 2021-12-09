import React from 'react'

import {
  Row,
  Col,
  Space,
  Avatar,
  Typography,
  Card,
  Divider,
  Button,
} from 'antd'
import IonIcon from 'shared/antd/ionicon'

const Mint = ({
  logoURI,
  symbol,
  name,
  onClick,
  advanced = false,
  onAdvanced = () => {},
  active = false,
}: {
  logoURI: string | undefined
  symbol: string
  name: string
  onClick: () => void
  advanced?: boolean
  onAdvanced?: () => void
  active?: boolean
}) => {
  const onPools = (e: React.MouseEvent) => {
    e.stopPropagation()
    return onAdvanced()
  }

  return (
    <Card
      className="card-child bg-white"
      bodyStyle={{ padding: `8px 16px`, cursor: 'pointer' }}
      bordered={active}
      onClick={onClick}
      hoverable
    >
      <Row gutter={[16, 16]} wrap={false}>
        <Col flex="auto">
          <Space size={12} style={{ marginLeft: -4 }}>
            <Avatar src={logoURI} size={32}>
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
        <Col>
          {advanced ? (
            <Button
              type="text"
              className="contained"
              icon={<IonIcon name="arrow-forward-circle-outline" />}
              style={{ marginRight: -7 }}
              onClick={onPools}
            >
              View Pools
            </Button>
          ) : null}
        </Col>
      </Row>
    </Card>
  )
}

export default Mint
