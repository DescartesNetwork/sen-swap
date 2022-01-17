import { useState } from 'react'
import { useSelector } from 'react-redux'

import { Row, Col, Typography, Space, Button, Popover } from 'antd'
import IonIcon from 'shared/antd/ionicon'
import PreviewSwap from 'app/components/preview'
import SwapInput from 'app/components/swapForm/swapInput'

import { AppState } from 'app/model'
import usePriceImpact, { usePriceColor } from 'app/hooks/usePriceImpact'
import { numeric } from 'shared/util'
import ConfirmSwap from 'app/components/confirmSwap'

const Widget = () => {
  const [visible, setVisible] = useState(false)
  const {
    route: { best },
    bid: { amount: bidAmount },
    ask: { amount: askAmount },
  } = useSelector((state: AppState) => state)
  const priceImpact = usePriceImpact()
  const priceColor = usePriceColor()

  const disabled = !best.length || !Number(bidAmount) || !Number(askAmount)

  return (
    <Row gutter={[12, 12]}>
      <Col span={24}>
        <SwapInput />
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
                <Typography.Text style={{ color: priceColor }}>
                  {numeric(Number(priceImpact)).format('0.[0000]%')}
                </Typography.Text>
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
      <ConfirmSwap visible={visible} onCancel={setVisible} />
    </Row>
  )
}

export default Widget
