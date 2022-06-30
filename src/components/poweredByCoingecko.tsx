import { Avatar, Space, Tooltip, Typography } from 'antd'
import CoinGeckoIcon from 'static/images/coingecko-logo.png'

export type PoweredByCoinGeckoProps = {
  title?: string
  spacing?: number
  iconSize?: number
}

const PoweredByCoinGecko = ({
  title = 'Powered by',
  spacing = 4,
  iconSize = 20,
}: PoweredByCoinGeckoProps) => {
  return (
    <Space size={spacing} style={{ cursor: 'pointer' }}>
      <Typography.Text style={{ fontSize: 12, color: '#7A7B85' }}>
        {title}
      </Typography.Text>
      <Tooltip title="CoinGecko">
        <Avatar src={CoinGeckoIcon} size={iconSize} />
      </Tooltip>
    </Space>
  )
}

export default PoweredByCoinGecko
