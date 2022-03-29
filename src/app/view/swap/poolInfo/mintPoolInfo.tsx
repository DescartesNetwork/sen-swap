import { Space, Typography } from 'antd'
import { MintAvatar, MintSymbol } from 'shared/antd/mint'

import { numeric } from 'shared/util'

const MintPoolInfo = ({
  mintAddress,
  tvl = '',
  price,
  format = '0,0.[00]a',
}: {
  mintAddress: string
  tvl?: string | number
  price?: number
  format?: string
}) => {
  return (
    <Space direction="vertical" size={4}>
      <MintAvatar mintAddress={mintAddress} />
      <Space>
        <Typography.Text>TVL:</Typography.Text>
        <Typography.Title level={5}>
          {numeric(tvl).format(format)}
        </Typography.Title>
        <Typography.Title level={5}>
          <MintSymbol mintAddress={mintAddress} />
        </Typography.Title>
      </Space>
      <Typography.Text className="caption" type="secondary">
        ~ ${numeric(price).format(format)}
      </Typography.Text>
    </Space>
  )
}

export default MintPoolInfo
