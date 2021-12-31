import { Space, Tag, Typography } from 'antd'
import { randomColor } from 'shared/util'

const WORMHOLE_COLOR = '#F9575E'

const WormHoleSupported = () => {
  return (
    <Space size={4}>
      <Tag
        style={{
          margin: 0,
          borderRadius: 4,
          color: randomColor(WORMHOLE_COLOR),
        }}
        color={randomColor(WORMHOLE_COLOR, 0.2)}
      >
        Wormhole Bridge
      </Tag>
      <Typography.Text type="secondary">Supported</Typography.Text>
    </Space>
  )
}

export default WormHoleSupported
