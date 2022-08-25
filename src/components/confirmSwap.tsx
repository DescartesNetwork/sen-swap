import { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'

import { Row, Col, Space, Typography, Modal, Card, Checkbox } from 'antd'
import Preview from 'components/preview'
import IonIcon from '@sentre/antd-ionicon'
import SwapAction from 'components/swapAction'
import { MintAvatar, MintSymbol } from '@sen-use/app'

import { AppState } from 'model'
import { PriceImpact } from 'constant/swap'

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

  const onCloseModal = useCallback(() => {
    onCancel(false)
    setChecked(false)
  }, [onCancel])

  return (
    <Modal
      onCancel={onCloseModal}
      closeIcon={<IonIcon name="close" />}
      footer={null}
      visible={visible}
      forceRender
    >
      <Row gutter={[16, 24]}>
        <Col span={24}>
          <Typography.Title level={4}> Confirm swaps</Typography.Title>
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
          <SwapAction onCallback={onCloseModal} forceSwap={checked} />
        </Col>
      </Row>
    </Modal>
  )
}
export default ConfirmSwap
