import { Fragment, useState } from 'react'
import { useSelector } from 'react-redux'

import { Row, Col, Typography, Space, Button, Popover, Divider } from 'antd'
import IonIcon from 'shared/antd/ionicon'
import PreviewSwap from 'app/components/preview'
import SwapInput from 'app/components/swapForm/swapInput'
import PoweredByJupiter from 'app/components/poweredByJupiter'

import { AppState } from 'app/model'
import { numeric } from 'shared/util'
import ConfirmSwap from 'app/components/confirmSwap'
import { priceImpactColor } from 'app/helper/utils'
import { SwapPlatform } from 'app/model/route.controller'
import { useDisabledSwap } from 'app/hooks/useDisabledSwap'

const Widget = () => {
  const [visible, setVisible] = useState(false)
  const {
    route: { platform, priceImpact, loadingJubRoute },
  } = useSelector((state: AppState) => state)

  const disabled = useDisabledSwap()
  return (
    <Row gutter={[24, 14]} className="senswap-widget">
      <Col span={24}>
        <SwapInput widget />
      </Col>
      <Col span={24}>
        <Row gutter={[12, 12]} style={{ padding: '0 16px', margin: '0 -12px' }}>
          <Col span={24}>
            <Row>
              <Col flex="auto" />
              <Col>
                <Popover
                  placement="bottomLeft"
                  content={<PreviewSwap />}
                  trigger="click"
                >
                  <Space style={{ cursor: 'pointer' }} size={4}>
                    <Space>
                      <Typography.Text>
                        <IonIcon
                          name="information-circle-outline"
                          style={{ color: '#7A7B85' }}
                        />
                      </Typography.Text>
                      <Typography.Text type="secondary">
                        Price impact:
                      </Typography.Text>
                      <Typography.Text
                        style={{ color: priceImpactColor(priceImpact) }}
                      >
                        {numeric(Number(priceImpact)).format('0.[0000]%')}
                      </Typography.Text>
                      {platform === SwapPlatform.JupiterAggregator && (
                        <Fragment>
                          <Divider type="vertical" style={{ margin: 0 }} />
                          <PoweredByJupiter />
                        </Fragment>
                      )}
                    </Space>
                  </Space>
                </Popover>
              </Col>
            </Row>
          </Col>
          <Col span={24} style={{ padding: 0 }}>
            <Button
              onClick={() => setVisible(true)}
              type="primary"
              size="large"
              disabled={disabled}
              loading={loadingJubRoute}
              block
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
