import { utils, Swap } from '@senswap/sen-js'
import { HopData } from 'app/components/preview/hop'
import { extractReserve } from './router'

export const ORACLE = Swap.oracle

export const curve = (bidAmount: string, data: HopData): string => {
  const {
    srcMintInfo: { address: srcMintAddress, decimals: bidDecimals },
    dstMintInfo: { address: dstMintAddress, decimals: askDecimals },
  } = data
  const { fee_ratio, tax_ratio } = data.poolData
  const bidReserve = extractReserve(srcMintAddress, data.poolData)
  const askReserve = extractReserve(dstMintAddress, data.poolData)
  if (!bidReserve || !askReserve) return '0'

  const { askAmount } = ORACLE.swap(
    utils.decimalize(bidAmount, bidDecimals),
    bidReserve,
    askReserve,
    fee_ratio,
    tax_ratio,
  )
  return utils.undecimalize(askAmount, askDecimals)
}

export const inverseCurve = (askAmount: string, data: HopData): string => {
  const {
    srcMintInfo: { address: srcMintAddress, decimals: bidDecimals },
    dstMintInfo: { address: dstMintAddress, decimals: askDecimals },
  } = data
  const { fee_ratio, tax_ratio } = data.poolData
  const bidReserve = extractReserve(srcMintAddress, data.poolData)
  const askReserve = extractReserve(dstMintAddress, data.poolData)
  const bidAmount = ORACLE.inverseSwap(
    utils.decimalize(askAmount, askDecimals),
    bidReserve,
    askReserve,
    fee_ratio,
    tax_ratio,
  )
  return utils.undecimalize(bidAmount, bidDecimals)
}

export const slippage = (bidAmount: string, data: HopData): bigint => {
  const {
    srcMintInfo: { address: srcMintAddress, decimals: bidDecimals },
    dstMintInfo: { address: dstMintAddress },
  } = data
  const { fee_ratio, tax_ratio } = data.poolData
  const bidReserve = extractReserve(srcMintAddress, data.poolData)
  const askReserve = extractReserve(dstMintAddress, data.poolData)

  const slippage = ORACLE.slippage(
    utils.decimalize(bidAmount, bidDecimals),
    bidReserve,
    askReserve,
    fee_ratio,
    tax_ratio,
  )
  return slippage
}
