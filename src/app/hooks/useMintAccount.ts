import { useMemo } from 'react'

import { utils } from '@senswap/sen-js'
import { useAccount, useWallet } from 'senhub/providers'

import { SOL_ADDRESS } from 'app/constant/sol'
import useMintDecimals from 'shared/hooks/useMintDecimals'

export const useMintAccount = (accountAddr: string) => {
  const { accounts } = useAccount()
  const { wallet } = useWallet()

  const { amount, mint } = useMemo(() => {
    // sol account
    if (accountAddr === wallet.address)
      return { amount: wallet.lamports, mint: SOL_ADDRESS }
    // spl token account
    return accounts[accountAddr] || {}
  }, [accountAddr, accounts, wallet.address, wallet.lamports])

  const decimals = useMintDecimals(mint) || 0
  const mintInfo = useMemo(() => {
    return {
      balance: utils.undecimalize(amount, decimals),
      mint,
      amount,
      decimals,
    }
  }, [amount, decimals, mint])

  return mintInfo
}
