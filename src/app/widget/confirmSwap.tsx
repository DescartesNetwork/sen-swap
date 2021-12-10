import { useSelector } from 'react-redux'

import { Avatar, Col, Divider, Row, Space, Typography } from 'antd'
import PreviewSwap from 'app/components/preview'
import IonIcon from 'shared/antd/ionicon'

import { AppState } from 'app/model'

const ConfirmSwap = () => {
  const bidData = useSelector((state: AppState) => state.bid)
  const askData = useSelector((state: AppState) => state.ask)

  return (
    <Row gutter={[16, 24]}>
      <Col span={24}>
        <Row align="middle" justify="space-between">
          <Col>
            <Space direction="vertical">
              <Typography.Text>From</Typography.Text>
              <Typography.Text>
                <Space>
                  <Avatar src={bidData.mintInfo?.logoURI} />
                  {bidData.mintInfo?.symbol}
                </Space>
              </Typography.Text>
              <Typography.Title level={4}>{bidData.amount}</Typography.Title>
            </Space>
          </Col>
          <Col>
            <IonIcon name="arrow-forward-outline" style={{ fontSize: 24 }} />
          </Col>
          <Col>
            <Space direction="vertical">
              <Typography.Text>To</Typography.Text>
              <Space>
                <Avatar src={askData.mintInfo?.logoURI} />
                {askData.mintInfo?.symbol}
              </Space>
              <Typography.Title level={4}>{askData.amount}</Typography.Title>
            </Space>
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <Divider style={{ margin: 0 }} />
      </Col>
      <Col>
        <PreviewSwap />
      </Col>
    </Row>
  )
}

export default ConfirmSwap
