import { useState } from 'react'

import { Button, Card, Col, Row, Typography } from 'antd'
import Preview from 'app/components/preview'

import ConfirmSwap from 'app/components/confirmSwap'
import { useDisabled } from 'app/components/swapAction/useDisabled'

const SwapActions = () => {
  const [visivle, setVisivle] = useState(false)
  const disabled = useDisabled()

  return (
    <Card bordered={false}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Typography.Title level={5}>Review & Swap</Typography.Title>
        </Col>
        <Col span={24}>
          <Preview />
        </Col>
        <Col span={24} /> {/* Safe sapce */}
        <Col span={24}>
          <Button
            type="primary"
            onClick={() => setVisivle(true)}
            disabled={disabled}
            block
          >
            Review & Swap
          </Button>
        </Col>
        <ConfirmSwap visible={visivle} onCancel={setVisivle} />
      </Row>
    </Card>
  )
}

export default SwapActions
