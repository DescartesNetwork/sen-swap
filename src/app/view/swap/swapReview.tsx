import { useState } from 'react'
import { useSelector } from 'react-redux'

import { Button, Card, Col, Row, Typography } from 'antd'
import Preview from 'app/components/preview'

import ConfirmSwap from 'app/components/confirmSwap'
import { useSwapStatus } from 'app/hooks/useSwapStatus'
import { AppState } from 'app/model'

const SwapActions = () => {
  const [visible, setVisible] = useState(false)
  const { disabled, loading } = useSwapStatus()
  const { enhancement } = useSelector((state: AppState) => state.settings)

  return (
    <Card bordered={false}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Typography.Title level={5}>Review & Swap</Typography.Title>
        </Col>
        <Col span={24}>
          <Preview />
        </Col>
        {enhancement && <Col span={24} />} {/* Safe sapce */}
        <Col span={24}>
          <Button
            type="primary"
            onClick={() => setVisible(true)}
            disabled={disabled}
            loading={loading}
            block
          >
            Review & Swap
          </Button>
        </Col>
        <ConfirmSwap visible={visible} onCancel={setVisible} />
      </Row>
    </Card>
  )
}

export default SwapActions
