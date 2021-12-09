import { Row, Col } from 'antd'
import SwapChart from './chart'
import Swap from './swap'
import History from './history'

import 'app/static/styles/index.less'

const Page = () => {
  return (
    <Row gutter={[24, 24]}>
      <Col lg={8} md={12} xs={24}>
        <Swap />
      </Col>
      <Col lg={16} md={12} xs={24}>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <SwapChart />
          </Col>
          <Col span={24}>
            <History />
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default Page
