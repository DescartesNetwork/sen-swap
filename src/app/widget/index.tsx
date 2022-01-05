import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { DEFAULT_WSOL, utils } from '@senswap/sen-js'

import { Row, Col, Typography, Space, Button, Popover, Modal } from 'antd'
import IonIcon from 'shared/antd/ionicon'
import PreviewSwap from 'app/components/preview'
import ConfirmSwap from './confirmSwap'
import SwapButton from 'app/components/swapButton'
import SwapAction from 'app/components/swap/swapAction'

import { AppState } from 'app/model'
import usePriceImpact from 'app/hooks/usePriceImpact'
import { numeric } from 'shared/util'
import useAccountBalance from 'shared/hooks/useAccountBalance'

const Widget = () => {
  const [visible, setVisible] = useState(false)
  const {
    route,
    bid: {
      amount: bidAmount,
      mintInfo: { address: bidMintAddress, decimals: bidMintDecimals },
      accountAddress: bidAccountAddress,
    },
    ask: { amount: askAmount },
    settings: { advanced },
  } = useSelector((state: AppState) => state)
  const priceImpact = usePriceImpact()
  const { amount: bidBalance } = useAccountBalance(bidAccountAddress)

  const wrapAmount = useMemo(() => {
    if (!Number(bidAmount) || bidMintAddress !== DEFAULT_WSOL) return BigInt(0)
    const amount = utils.decimalize(bidAmount, bidMintDecimals)
    if (amount <= bidBalance) return BigInt(0)
    return amount - bidBalance
  }, [bidBalance, bidAmount, bidMintAddress, bidMintDecimals])

  const tooHightImpact = !advanced && priceImpact * 100 > 12.5
  const disabled =
    !route?.best.length ||
    !parseFloat(bidAmount) ||
    parseFloat(bidAmount) < 0 ||
    !parseFloat(askAmount) ||
    parseFloat(askAmount) < 0

  return (
    <Row gutter={[12, 12]}>
      <Col span={24}>
        <SwapAction spacing={12} />
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
        footer={
          <SwapButton
            wrapAmount={wrapAmount}
            onCallback={() => setVisible(false)}
            hightImpact={tooHightImpact}
            disabled={disabled || tooHightImpact}
          />
        }
        visible={visible}
      >
        <ConfirmSwap />
      </Modal>
    </Row>
  )
}

export default Widget
