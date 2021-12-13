import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import { Row, Col, Typography, Space, Button, Popover, Modal } from 'antd'
import IonIcon from 'shared/antd/ionicon'
import PreviewSwap from 'app/components/preview'
import ConfirmSwap from './confirmSwap'
import SwapButton from 'app/components/swapButton'
import SwapAction from 'app/components/swap/swapAction'

import { AppState } from 'app/model'
import { useAccount } from 'senhub/providers'
import { DEFAULT_WSOL, utils } from '@senswap/sen-js'

const Widget = () => {
  const [visible, setVisible] = useState(false)
  const { route } = useSelector((state: AppState) => state.route)
  const bidData = useSelector((state: AppState) => state.bid)
  const askData = useSelector((state: AppState) => state.ask)
  const { accounts } = useAccount()

  const wrapAmount = useMemo(() => {
    const bidMint = bidData.mintInfo
    const bidAccount = accounts[bidData.accountAddress]
    const bidBalance = bidAccount?.amount || BigInt(0)

    if (!bidMint || !Number(bidData.amount)) return BigInt(0)
    if (bidMint.address !== DEFAULT_WSOL) return BigInt(0)

    const bidAmount = utils.decimalize(bidData.amount, bidMint.decimals)
    if (bidAmount <= bidBalance) return BigInt(0)
    return bidAmount - bidBalance
  }, [accounts, bidData.accountAddress, bidData.amount, bidData.mintInfo])

  const disabled =
    !route?.hops.length ||
    !parseFloat(bidData.amount) ||
    parseFloat(bidData.amount) < 0 ||
    !parseFloat(askData?.amount) ||
    parseFloat(askData?.amount) < 0
  return (
    <Row style={{ padding: '8px' }}>
      <Space direction="vertical" size={20}>
        <Col span={24}>
          <SwapAction />
        </Col>
        <Col span={24}>
          <Row align="bottom">
            <Col flex="auto">
              <Popover
                placement="bottomLeft"
                content={
                  <Row style={{ width: 307 }}>
                    <Col>
                      <PreviewSwap />
                    </Col>
                  </Row>
                }
                trigger="click"
              >
                <Space style={{ cursor: 'pointer' }} direction="vertical">
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
                      1.4%
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
      </Space>
      <Modal
        title={<Typography.Title level={4}> Confirm swap</Typography.Title>}
        onCancel={() => setVisible(false)}
        footer={
          <SwapButton
            hops={route?.hops || []}
            wrapAmount={wrapAmount}
            disabled={disabled}
            onCallback={() => setVisible(false)}
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
