import { useSelector } from 'react-redux'

import { Avatar, Space, Typography } from 'antd'
import { MintAvatar, MintSymbol } from 'shared/antd/mint'

import { AppState } from 'app/model'

const Cross = () => {
  const {
    bid: { mintInfo: bidMintInfo },
    ask: { mintInfo: askMintInfo },
  } = useSelector((state: AppState) => state)

  const bidMintAddress = bidMintInfo?.address || ''
  const askMintAddress = askMintInfo?.address || ''
  return (
    <Space>
      <Avatar.Group>
        <MintAvatar mintAddress={askMintAddress} />
        <MintAvatar mintAddress={bidMintAddress} />
      </Avatar.Group>
      <Typography.Text>
        <MintSymbol mintAddress={askMintAddress} />
        {' / '}
        <MintSymbol mintAddress={bidMintAddress} />
      </Typography.Text>
    </Space>
  )
}

export default Cross
