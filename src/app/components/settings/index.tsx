import { useDispatch, useSelector } from 'react-redux'

import { Row, Col, Button, Popover, Typography } from 'antd'
import Slippage from './slippage'

import { updateSettings } from 'app/model/settings.controller'
import { AppDispatch, AppState } from 'app/model'
import IonIcon from 'shared/antd/ionicon'

const Settings = () => {
  const dispatch = useDispatch<AppDispatch>()
  const settings = useSelector((state: AppState) => state.settings)

  const onSlippage = (slippage: number) => {
    return dispatch(updateSettings({ ...settings, slippage }))
  }

  return (
    <Popover
      placement="bottomRight"
      overlayInnerStyle={{ width: 300 }}
      content={
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <Typography.Title level={5}>Settings</Typography.Title>
          </Col>
          <Col span={24}>
            <Slippage value={settings.slippage} onChange={onSlippage} />
          </Col>
        </Row>
      }
      trigger="click"
    >
      <Button
        type="text"
        shape="circle"
        size="small"
        icon={<IonIcon name="settings-outline" />}
      />
    </Popover>
  )
}

export default Settings
