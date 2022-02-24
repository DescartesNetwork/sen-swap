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
    route: { platform, priceImpact },
  } = useSelector((state: AppState) => state)

  const disabled = useDisabledSwap()

  return (
    <Row gutter={[8, 8]} className="senswap-widget">
      <Col span={24}>
        <SwapInput widget />
      </Col>
      <Col span={24}>
        <Row align="bottom" style={{ padding: '0 16px' }} wrap={false}>
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
          <Col>
            <Button
              onClick={() => setVisible(true)}
              type="primary"
              disabled={disabled}
              block
            >
              <Space>
                <span>Review</span>
                <IonIcon name="arrow-forward-outline" />
              </Space>
            </Button>
          </Col>
        </Row>
      </Col>
      <ConfirmSwap visible={visible} onCancel={setVisible} />
    </Row>
  )
}

export default Widget
