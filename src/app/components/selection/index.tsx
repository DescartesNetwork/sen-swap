import { useState, Fragment, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { forceCheck } from '@senswap/react-lazyload'

import { Row, Col, Avatar, Space, Typography, Divider, Modal } from 'antd'
import MintSelection, { SelectionInfo } from './mintSelection'
import IonIcon from 'shared/antd/ionicon'
import { SenLpState } from 'app/constant/senLpState'

const Selection = ({
  value,
  onChange,
}: {
  value: SelectionInfo
  onChange: (value: SelectionInfo) => void
}) => {
  const [visible, setVisible] = useState(false)
  const history = useHistory()
  const { state } = useLocation<SenLpState>()
  useEffect(() => {
    if (visible) setTimeout(forceCheck, 500)
  }, [visible])

  const onSelection = (selectionInfo: SelectionInfo) => {
    setVisible(false)

    // Clear state of senlp come to
    if (state) history.replace({ ...history.location, state: {} })

    return onChange(selectionInfo)
  }

  const { logoURI, symbol } = value?.mintInfo || {}
  return (
    <Fragment>
      <Space style={{ cursor: 'pointer' }} onClick={() => setVisible(true)}>
        <Avatar
          size={24}
          src={logoURI}
          style={{ backgroundColor: '#2D3355', border: 'none' }}
        >
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
