import { useSelector } from 'react-redux'
import { utils } from '@senswap/sen-js'

import { AppState } from 'app/model'
import { curve, slippage } from 'app/helper/oracle'

const PRECISION = 9

const usePriceImpact = () => {
  const {
    route: { hops },
    bid: { amount: bidAmount, mintInfo: bidMintInfo },
    ask: { amount: askAmount },
  } = useSelector((state: AppState) => state)

  if (!Number(bidAmount) || !Number(askAmount)) return 0
  let srcAmount = utils.decimalize(bidAmount, bidMintInfo.decimals)
  let p = 1
  hops.forEach((hopData) => {
    const s = Number(
      utils.undecimalize(slippage(srcAmount, hopData), PRECISION),
    )
    p = p * (1 - s)
    const dstAmount = curve(srcAmount, hopData)
    srcAmount = dstAmount
  })

  return 1 - p
}

export default usePriceImpact
