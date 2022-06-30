import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { utils } from '@senswap/sen-js'
import { useWallet } from '@sentre/senhub'

import { AppState } from 'model'

const PRECISION = BigInt(1000000000)

export const useHandleSwap = () => {
  const {
    route: { best },
    bid: {
      amount: _bidAmount,
      mintInfo: { decimals: bidMintDecimals },
    },
    ask: {
      amount: _askAmount,
      mintInfo: { decimals: askMintDecimals },
    },
    settings: { slippage },
  } = useSelector((state: AppState) => state)
  const {
    wallet: { address: walletAddress },
  } = useWallet()

  const handleSwap = useCallback(async () => {
    const { swap, splt, wallet } = window.sentre
    if (!wallet) throw new Error('Wallet is not connected')
    // Synthetize routings
    const routingAddresses = await Promise.all(
      best.map(
        async ({
          srcMintAddress,
          dstMintAddress,
          poolData: { address: poolAddress },
        }) => {
          const srcAddress = await splt.deriveAssociatedAddress(
            walletAddress,
            srcMintAddress,
          )
          const dstAddress = await splt.deriveAssociatedAddress(
            walletAddress,
            dstMintAddress,
          )
          return {
            poolAddress: poolAddress,
            srcAddress: srcAddress,
            dstAddress: dstAddress,
          }
        },
      ),
    )
    // Compute limit
    const bidAmount = utils.decimalize(_bidAmount, bidMintDecimals)
    const askAmount = utils.decimalize(_askAmount, askMintDecimals)
    const limit =
      (askAmount * (PRECISION - utils.decimalize(slippage, 9))) / PRECISION
    // Execute swap
    return await swap.route(bidAmount, limit, routingAddresses, wallet)
  }, [
    best,
    bidMintDecimals,
    askMintDecimals,
    slippage,
    walletAddress,
    _bidAmount,
    _askAmount,
  ])

  return handleSwap
}
