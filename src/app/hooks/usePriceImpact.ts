import { useSelector } from 'react-redux'
import { utils } from '@senswap/sen-js'

import { AppState } from 'app/model'
import { extractReserve } from 'app/helper/router'

const PRECISION = 9

const usePriceImpact = () => {
  const {
    route: { hops },
    bid: { amount: bidAmount, mintInfo: bidMintInfo },
    ask: { amount: askAmount, mintInfo: askMintInfo },
  } = useSelector((state: AppState) => state)

  if (!Number(bidAmount)) return 0

  const nextPrice = Number(askAmount) / Number(bidAmount)
  let decimalizedPrice = 1
  hops.forEach(({ srcMintAddress, dstMintAddress, poolData }) => {
    const srcReserve = extractReserve(srcMintAddress, poolData)
    const dstReserve = extractReserve(dstMintAddress, poolData)
    const hopPrice = utils.undecimalize(
      (dstReserve * BigInt(10 ** PRECISION)) / srcReserve,
      PRECISION,
    )
    decimalizedPrice = decimalizedPrice * Number(hopPrice)
  })
  const currentPrice =
    (decimalizedPrice * 10 ** bidMintInfo.decimals) / 10 ** askMintInfo.decimals
  const priceImpact = (currentPrice - nextPrice) / currentPrice

  return Math.max(priceImpact, 0)
}

export default usePriceImpact
