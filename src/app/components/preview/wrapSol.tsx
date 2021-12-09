import { useSelector } from 'react-redux'
import { utils } from '@senswap/sen-js'

import { Row, Col, Card, Space, Avatar, Typography, Tooltip } from 'antd'

import { AppState } from 'app/model'
import IonIcon from 'shared/ionicon'
import { numeric } from 'shared/util'

const WrapSol = ({ amount }: { amount: bigint }) => {
  const { mintInfo } = useSelector((state: AppState) => state.bid) || {}
  const wrappedAmount = utils.undecimalize(amount, mintInfo?.decimals || 9)
  return (
    <Card className="shadowed" bordered={false}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Row align="middle">
            <Col flex="auto">
              <Typography.Text>Wrap Solana</Typography.Text>
            </Col>
            <Col>
              <Tooltip
                title="The balance need 0.01 SOL at least to secure fees."
                placement="topRight"
              >
                <IonIcon
                  style={{ cursor: 'pointer' }}
                  name="help-circle-outline"
                />
              </Tooltip>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row align="middle">
            <Col flex="auto">
              <Space>
                <Avatar src={mintInfo?.logoURI} />
                <Typography.Title level={5} style={{ margin: 0 }}>
                  wSOL
                </Typography.Title>
              </Space>
            </Col>
            <Col>
              <Space>
                <Typography.Text type="secondary">Amount:</Typography.Text>
                <Tooltip title={wrappedAmount}>
                  <Typography.Text style={{ cursor: 'pointer' }}>
                    ~{numeric(wrappedAmount).format('0,0.[0000]')}
                  </Typography.Text>
                </Tooltip>
                <Typography.Text type="secondary">wSOL</Typography.Text>
              </Space>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  )
}

export default WrapSol
