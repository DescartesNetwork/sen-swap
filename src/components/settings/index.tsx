import { useDispatch, useSelector } from 'react-redux'

import { Row, Col, Button, Popover, Typography, Divider } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import PoweredBySentre from 'components/poweredBySentre'
import Slippage from './slippage'
import Advanced from './advanced'

import { updateSettings } from 'model/settings.controller'
import { AppDispatch, AppState } from 'model'
import Enhancement from './enhancement'

const Settings = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { slippage, advanced, enhancement } = useSelector(
    (state: AppState) => state.settings,
  )

  const onSlippage = (slippage: number) => {
    return dispatch(updateSettings({ slippage }))
  }
  const onAdvanced = (advanced: boolean) => {
    return dispatch(updateSettings({ advanced }))
  }
  const onEnhancement = (enhancement: boolean) => {
    return dispatch(updateSettings({ enhancement }))
  }

  return (
    <Row gutter={[4, 4]} justify="end" align="middle" wrap={false}>
      <Col>
        <PoweredBySentre />
      </Col>
      <Col>
        <Divider type="vertical" style={{ padding: 0 }} />
      </Col>
      <Col>
        <Popover
          placement="bottomRight"
          overlayInnerStyle={{ width: 300 }}
          content={
            <Row gutter={[8, 8]}>
              <Col span={24}>
                <Typography.Title level={5}>Settings</Typography.Title>
              </Col>
              <Col span={24}>
                <Slippage value={slippage} onChange={onSlippage} />
              </Col>
              <Divider style={{ margin: 0 }} />
              <Col span={24}>
                <Advanced value={advanced} onChange={onAdvanced} />
              </Col>
              <Divider style={{ margin: 0 }} />
              <Col span={24}>
                <Enhancement value={enhancement} onChange={onEnhancement} />
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
      </Col>
    </Row>
  )
}

export default Settings
