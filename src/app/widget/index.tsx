import { useState } from 'react'
import { useSelector } from 'react-redux'

import { Row, Col, Typography, Space, Button, Popover, Modal } from 'antd'
import IonIcon from 'shared/antd/ionicon'
import PreviewSwap from 'app/components/preview'
import ConfirmSwap from './confirmSwap'
import SwapAction from 'app/components/swapAction'
import SwapInput from 'app/components/swapForm/swapInput'

import { AppState } from 'app/model'
import usePriceImpact from 'app/hooks/usePriceImpact'
import { numeric } from 'shared/util'

const Widget = () => {
  const [visible, setVisible] = useState(false)
  const {
    route: { best },
    bid: { amount: bidAmount },
    ask: { amount: askAmount },
  } = useSelector((state: AppState) => state)
  const priceImpact = usePriceImpact()

  const disabled = !best.length || !Number(bidAmount) || !Number(askAmount)

  return (
    <Row gutter={[12, 12]}>
      <Col span={24}>
        <SwapInput spacing={12} />
      </Col>
      <Col span={24}>
        <Row align="bottom">
          <Col flex="auto">
            <Popover
              placement="bottomLeft"
              content={<PreviewSwap />}
              trigger="click"
            >
              <Space
                style={{ cursor: 'pointer' }}
                direction="vertical"
                size={4}
              >
                <Space>
                  <Typography.Text>
                    <IonIcon
                      name="information-circle-outline"
                      style={{ color: '#7A7B85' }}
                    />
                  </Typography.Text>
                  <Typography.Text type="secondary">
                    Price impact
                  </Typography.Text>
                </Space>
                <Space>
                  <Typography.Text style={{ color: '#D72311' }}>
                    <IonIcon name="arrow-down-outline" />
                  </Typography.Text>
                  <Typography.Text style={{ color: '#D72311' }}>
                    {numeric(Number(priceImpact)).format('0.[0000]%')}
                  </Typography.Text>
                </Space>
              </Space>
            </Popover>
          </Col>
          <Col>
            <Button
              onClick={() => setVisible(true)}
              size="large"
              block
              type="primary"
              disabled={disabled}
            >
              Review & Swap
            </Button>
          </Col>
        </Row>
      </Col>
      <Modal
        title={<Typography.Title level={4}> Confirm swap</Typography.Title>}
        onCancel={() => setVisible(false)}
        footer={<SwapAction onCallback={() => setVisible(false)} />}
        visible={visible}
      >
        <ConfirmSwap />
      </Modal>
    </Row>
  )
}

export default Widget
