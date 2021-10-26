import { Row, Col } from 'antd'
import AppLoader from 'os/components/appLoader'

import manifest from 'senhub.manifest'

const Dashboard = () => {
  return (
    <Row gutter={[24, 24]}>
      {Object.keys(manifest).map((appId, i) => (
        <Col key={appId + i}>
          <AppLoader type="Widget" {...manifest[appId]} />
        </Col>
      ))}
    </Row>
  )
}

export default Dashboard