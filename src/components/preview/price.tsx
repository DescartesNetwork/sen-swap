import { useState } from 'react'
import { useSelector } from 'react-redux'

import { Button, Space, Typography } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import { MintSymbol } from '@sen-use/components'

import { util } from '@sentre/senhub'
import { AppState } from 'model'

const Price = () => {
  const [reversed, setReversed] = useState(false)
  const {
    bid: { mintInfo: bidMintInfo, amount: bidAmount },
    ask: { mintInfo: askMintInfo, amount: askAmount },
  } = useSelector((state: AppState) => state)

  const bidMintAddress = bidMintInfo?.address || ''
  const askMintAddress = askMintInfo?.address || ''
  const price = util
    .numeric(Number(askAmount) / Number(bidAmount))
    .format('0,0.[000000]')
  const reversedPrice = util
    .numeric(Number(bidAmount) / Number(askAmount))
    .format('0,0.[000000]')

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
