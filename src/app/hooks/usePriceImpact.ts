import { useSelector } from 'react-redux'
import { utils } from '@senswap/sen-js'

import { AppState } from 'app/model'

const PRECISION = 9

const usePriceImpact = () => {
  const {
    route: { hops },
    bid: { amount: bidAmount, mintInfo: bidMintInfo },
    ask: { amount: askAmount, mintInfo: askMintInfo },
  } = useSelector((state: AppState) => state)

  const nextPrice = Number(askAmount) / Number(bidAmount)
  let decimalizedPrice = 1
  hops.forEach(({ poolData }) => {
    const { reserve_a, reserve_b } = poolData
    const hopPrice = utils.undecimalize(
      (reserve_b * BigInt(10 ** PRECISION)) / reserve_a,
      PRECISION,
    )
    decimalizedPrice = decimalizedPrice * Number(hopPrice)
  })
  const currentPrice =
    (decimalizedPrice * 10 ** (bidMintInfo?.decimals || 0)) /
    10 ** (askMintInfo?.decimals || 0)
  const priceImpact = (currentPrice - nextPrice) / currentPrice

  return priceImpact
}

export default usePriceImpact
