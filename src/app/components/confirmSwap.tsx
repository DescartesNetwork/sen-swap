import { useState } from 'react'
import { useSelector } from 'react-redux'

import { Row, Col, Space, Typography, Modal, Card, Checkbox } from 'antd'
import Preview from 'app/components/preview'
import IonIcon from 'shared/antd/ionicon'
import { MintAvatar, MintSymbol } from 'shared/antd/mint'
import SwapAction from 'app/components/swapAction'

import { AppState } from 'app/model'
import { PriceImpact } from 'app/constant/swap'

const ConfirmSwap = ({
  visible = false,
  onCancel = () => {},
}: {
  visible?: boolean
  onCancel?: (visible: boolean) => void
}) => {
  const [checked, setChecked] = useState(false)
  const {
    route: { priceImpact },
    bid: bidData,
    ask: askData,
  } = useSelector((state: AppState) => state)

  const tooHighImpact = priceImpact > PriceImpact.acceptableSwap

  return (
    <Modal
      onCancel={() => onCancel(false)}
      closeIcon={<IonIcon name="close" />}
      footer={null}
      visible={visible}
      forceRender
    >
      <Row gutter={[16, 24]}>
        <Col span={24}>
          <Typography.Title level={4}> Confirm swap</Typography.Title>
        </Col>
        <Col span={24}>
          <Row align="middle" justify="space-between">
            <Col>
              <Space direction="vertical">
                <Typography.Text>From</Typography.Text>
                <Space>
                  <MintAvatar mintAddress={bidData.mintInfo?.address} />
                  <Typography.Text>
                    <MintSymbol mintAddress={bidData.mintInfo?.address} />
                  </Typography.Text>
                </Space>
                <Typography.Title level={4}>{bidData.amount}</Typography.Title>
              </Space>
            </Col>
            <Col>
              <IonIcon name="arrow-forward-outline" style={{ fontSize: 24 }} />
            </Col>
            <Col>
              <Space direction="vertical" align="end">
                <Typography.Text>To</Typography.Text>
                <Space>
                  <MintAvatar mintAddress={askData.mintInfo?.address} />
                  <Typography.Text>
                    <MintSymbol mintAddress={askData.mintInfo?.address} />
                  </Typography.Text>
                </Space>
                <Typography.Title level={4}>{askData.amount}</Typography.Title>
              </Space>
            </Col>
          </Row>
        </Col>
        <Col>
          <Card bordered={false} className="confirm-info">
            <Preview />
          </Card>
        </Col>
        {tooHighImpact && (
          <Col span={24}>
            <Checkbox checked={checked} onChange={() => setChecked(!checked)}>
              The price impact is currently high. Tick the checkbox to accept
              the swap.
            </Checkbox>
          </Col>
        )}
        <Col span={24}>
          <SwapAction onCallback={() => onCancel(false)} forceSwap={checked} />
        </Col>
      </Row>
    </Modal>
  )
}
export default ConfirmSwap
