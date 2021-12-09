import { useState, Fragment, useEffect } from 'react'
import { forceCheck } from 'react-lazyload'

import { Row, Col, Avatar, Space, Typography, Divider, Modal } from 'antd'
import MintSelection, { SelectionInfo } from './mintSelection'
import IonIcon from 'shared/ionicon'

const Selection = ({
  value,
  onChange,
}: {
  value: SelectionInfo
  onChange: (value: SelectionInfo) => void
}) => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (visible) setTimeout(forceCheck, 500)
  }, [visible])

  const onSelection = (selectionInfo: SelectionInfo) => {
    setVisible(false)
    return onChange(selectionInfo)
  }

  const { logoURI, symbol } = value?.mintInfo || {}
  return (
    <Fragment>
      <Space
        style={{ marginLeft: -6, cursor: 'pointer' }}
        onClick={() => setVisible(true)}
      >
        <Avatar size={24} src={logoURI}>
          <IonIcon name="diamond-outline" />
        </Avatar>
        <Typography.Text type="secondary" style={{ margin: 0 }}>
          {symbol || 'TOKEN'}
        </Typography.Text>
        <Divider type="vertical" style={{ marginLeft: 4 }} />
      </Space>
      <Modal
        visible={visible}
        onCancel={() => setVisible(false)}
        closeIcon={<IonIcon name="close" />}
        footer={null}
        destroyOnClose={true}
        centered={true}
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <MintSelection value={value} onChange={onSelection} />
          </Col>
        </Row>
      </Modal>
    </Fragment>
  )
}

export default Selection
