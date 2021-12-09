import { Avatar, Space, Typography } from 'antd'
import SentreIcon from 'app/static/images/sen.svg'

const PoweredBy = ({
  spacing = 4,
  iconSize = 20,
}: {
  spacing?: number
  iconSize?: number
}) => {
  return (
    <Space size={spacing}>
      <Typography.Text style={{ fontSize: 12, color: '#7A7B85' }}>
        Powered by
      </Typography.Text>
      <Avatar src={SentreIcon} size={iconSize} />
    </Space>
  )
}

export default PoweredBy
