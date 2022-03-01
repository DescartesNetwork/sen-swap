import { Avatar, Space, Tooltip, Typography } from 'antd'
import JupiterIcon from 'app/static/images/jupiter-logo.svg'

export type PoweredByJupiterProps = {
  title?: string
  spacing?: number
  iconSize?: number
}

const PoweredByJupiter = ({
  title = 'Powered by',
  spacing = 4,
  iconSize = 20,
}: PoweredByJupiterProps) => {
  return (
    <Space size={spacing} style={{ cursor: 'pointer' }}>
      <Typography.Text style={{ fontSize: 12, color: '#7A7B85' }}>
        {title}
      </Typography.Text>
      <Tooltip title="Jupiter Aggregator">
        <Avatar src={JupiterIcon} size={iconSize} />
      </Tooltip>
    </Space>
  )
}

export default PoweredByJupiter
