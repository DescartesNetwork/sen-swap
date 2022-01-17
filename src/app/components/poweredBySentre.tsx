import { Avatar, Space, Tooltip, Typography } from 'antd'
import SentreIcon from 'app/static/images/sen.svg'

const PoweredBy = ({
  spacing = 4,
  iconSize = 20,
}: {
  spacing?: number
  iconSize?: number
}) => {
  return (
    <Tooltip title="Sentre Protocol">
      <Space size={spacing} style={{ cursor: 'pointer' }}>
        <Typography.Text style={{ fontSize: 12, color: '#7A7B85' }}>
          Powered by
        </Typography.Text>
        <Avatar src={SentreIcon} size={iconSize} />
      </Space>
    </Tooltip>
  )
}

export default PoweredBy
