import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { utils } from '@senswap/sen-js'

import { curve } from 'app/helper/oracle'
import { AppState } from 'app/model'

export const useSlippageRate = () => {
  const { route } = useSelector((state: AppState) => state.route)
  const bidData = useSelector((state: AppState) => state.bid)
  const askMount = useSelector((state: AppState) => state.ask)

  const { amounts = [], hops = [] } = route || {}
  const slippageRate = useMemo(() => {
    let newAmount = bidData.amount
    hops.forEach((hop, i) => {
      const { dstMintInfo, srcMintInfo, poolData } = hop
      const newPoolData = { ...poolData }
      const srcAmount = amounts[i]
      const srcDecimals = srcMintInfo.decimals
      const dstAmount = amounts[i + 1] || askMount.amount
      const dstDecimals = dstMintInfo.decimals
      if (srcMintInfo.address === poolData.mint_a) {
        newPoolData.reserve_a += utils.decimalize(srcAmount, srcDecimals)
        newPoolData.reserve_b -= utils.decimalize(dstAmount, dstDecimals)
      } else {
        newPoolData.reserve_b += utils.decimalize(srcAmount, srcDecimals)
        newPoolData.reserve_a -= utils.decimalize(dstAmount, dstDecimals)
      }
      newAmount = curve(newAmount, { ...hop, poolData: newPoolData })
    })
    return 1 - Number(newAmount) / Number(askMount.amount)
  }, [amounts, askMount.amount, bidData.amount, hops])

  return slippageRate
}
