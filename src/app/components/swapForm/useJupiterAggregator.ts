import { useSelector } from 'react-redux'
import { account } from '@senswap/sen-js'
import { useJupiter } from '@jup-ag/react-hook'

import { AppState } from 'app/model'
import { useMemo } from 'react'

const useJupiterAggregator = () => {
  const {
    bid: bidData,
    ask: askData,
    settings: { slippage },
  } = useSelector((state: AppState) => state)

  const {
    mintInfo: { address: bidMintAddress },
    amount: bidAmount,
  } = bidData
  const {
    mintInfo: { address: askMintAddress },
  } = askData

  const amount = Number(bidAmount) * 10 ** 6
  const inputMint = useMemo(
    () =>
      account.isAddress(bidMintAddress)
        ? account.fromAddress(bidMintAddress)
        : undefined,
    [bidMintAddress],
  )
  const outputMint = useMemo(
    () =>
      account.isAddress(askMintAddress)
        ? account.fromAddress(askMintAddress)
        : undefined,
    [askMintAddress],
  )

  // Jupiter Aggregator
  const jupiter = useJupiter({
    amount,
    inputMint,
    outputMint,
    slippage: slippage * 100,
    debounceTime: 250,
  })

  return jupiter
}

export default useJupiterAggregator
