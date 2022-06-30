import { PriceImpact } from 'constant/swap'

export const priceImpactColor = (priceImpact: number) => {
  if (priceImpact < PriceImpact.goodSwap) return '#14E041'
  if (priceImpact > PriceImpact.acceptableSwap) return '#D72311'
  return '#FA8C16'
}
