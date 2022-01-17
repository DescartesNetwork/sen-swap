import { DEFAULT_WSOL, utils } from '@senswap/sen-js'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { AppState } from 'app/model'
import useAccountBalance from 'shared/hooks/useAccountBalance'

export const useWrapSol = () => {
  const {
    bid: {
      amount: _bidAmount,
      mintInfo: { address: bidMintAddress, decimals: bidMintDecimals },
      accountAddress: bidAccountAddress,
    },
  } = useSelector((state: AppState) => state)
  const { amount: bidBalance } = useAccountBalance(bidAccountAddress)

  const wrapAmount = useMemo(() => {
    if (!Number(_bidAmount) || bidMintAddress !== DEFAULT_WSOL) return BigInt(0)
    const amount = utils.decimalize(_bidAmount, bidMintDecimals)
    if (amount <= bidBalance) return BigInt(0)
    return amount - bidBalance
  }, [bidBalance, _bidAmount, bidMintAddress, bidMintDecimals])

  const wrapSol = async () => {
    const { swap, wallet } = window.sentre
    if (!wallet) throw new Error('Wallet is not connected')
    if (wrapAmount) return await swap.wrapSol(wrapAmount, wallet)
  }

  return { wrapAmount, wrapSol }
}
