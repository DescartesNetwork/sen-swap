import { useSelector } from 'react-redux'

import { Row, Col, Divider, Space, Typography } from 'antd'
import Preview from 'app/components/preview'
import IonIcon from 'shared/antd/ionicon'
import { MintAvatar, MintSymbol } from 'shared/antd/mint'

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
              <Space>
                <MintAvatar mintAddress={bidData.mintInfo?.address || ''} />
                <Typography.Text>
                  <MintSymbol mintAddress={bidData.mintInfo?.address || ''} />
                </Typography.Text>
              </Space>
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
                <MintAvatar mintAddress={askData.mintInfo?.address || ''} />
                <Typography.Text>
                  <MintSymbol mintAddress={askData.mintInfo?.address || ''} />
                </Typography.Text>
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
        <Preview />
      </Col>
    </Row>
  )
}

export default ConfirmSwap
