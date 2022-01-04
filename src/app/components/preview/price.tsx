import { useState } from 'react'
import { useSelector } from 'react-redux'

import { Button, Space, Typography } from 'antd'
import IonIcon from 'shared/antd/ionicon'
import { MintSymbol } from 'shared/antd/mint'

import { numeric } from 'shared/util'
import { AppState } from 'app/model'

const Price = () => {
  const [reversed, setReversed] = useState(false)
  const {
    bid: { mintInfo: bidMintInfo, amount: bidAmount },
    ask: { mintInfo: askMintInfo, amount: askAmount },
  } = useSelector((state: AppState) => state)

  const bidMintAddress = bidMintInfo?.address || ''
  const askMintAddress = askMintInfo?.address || ''
  const price = numeric(Number(askAmount) / Number(bidAmount)).format(
    '0,0.[000000]',
  )
  const reversedPrice = numeric(Number(bidAmount) / Number(askAmount)).format(
    '0,0.[000000]',
  )

  return (
    <Space>
      <Button
        type="text"
        onClick={() => setReversed(!reversed)}
        shape="circle"
        icon={<IonIcon name="swap-horizontal-outline" />}
      />
      <Typography.Text>{!reversed ? price : reversedPrice}</Typography.Text>
      <Typography.Text>
        {!reversed ? (
          <MintSymbol mintAddress={askMintAddress} />
        ) : (
          <MintSymbol mintAddress={bidMintAddress} />
        )}
        {' / '}
        {!reversed ? (
          <MintSymbol mintAddress={bidMintAddress} />
        ) : (
          <MintSymbol mintAddress={askMintAddress} />
        )}
      </Typography.Text>
    </Space>
  )
}

export default Price
