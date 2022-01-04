import { Swap } from '@senswap/sen-js'
import { HopData } from 'app/components/preview/index'
import { extractReserve } from './router'

export const ORACLE = Swap.oracle

export const curve = (bidAmount: bigint, hopData: HopData): bigint => {
  if (!bidAmount) return BigInt(0)
  const { srcMintAddress, dstMintAddress, poolData } = hopData
  const { fee_ratio, tax_ratio } = poolData
  const bidReserve = extractReserve(srcMintAddress, poolData)
  const askReserve = extractReserve(dstMintAddress, poolData)
  if (!bidReserve || !askReserve) return BigInt(0)

  const { askAmount } = ORACLE.swap(
    bidAmount,
    bidReserve,
    askReserve,
    fee_ratio,
    tax_ratio,
  )
  return askAmount
}

export const inverseCurve = (askAmount: bigint, data: HopData): bigint => {
  if (!askAmount) return BigInt(0)
  const { srcMintAddress, dstMintAddress, poolData } = data
  const { fee_ratio, tax_ratio } = poolData
  const bidReserve = extractReserve(srcMintAddress, poolData)
  const askReserve = extractReserve(dstMintAddress, poolData)
  if (!bidReserve || !askReserve) return BigInt(0)

  const bidAmount = ORACLE.inverseSwap(
    askAmount,
    bidReserve,
    askReserve,
    fee_ratio,
    tax_ratio,
  )
  return bidAmount
}

export const slippage = (bidAmount: bigint, data: HopData): bigint => {
  if (!bidAmount) return BigInt(0)
  const { srcMintAddress, dstMintAddress, poolData } = data
  const { fee_ratio, tax_ratio } = poolData
  const bidReserve = extractReserve(srcMintAddress, poolData)
  const askReserve = extractReserve(dstMintAddress, poolData)
  if (!bidReserve || !askReserve) return BigInt(0)

  const slippage = ORACLE.slippage(
    bidAmount,
    bidReserve,
    askReserve,
    fee_ratio,
    tax_ratio,
  )
  return slippage
}
