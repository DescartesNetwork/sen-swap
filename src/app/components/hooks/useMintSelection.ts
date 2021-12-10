import { useCallback, useEffect, useState } from 'react'
import { TokenInfo } from '@solana/spl-token-registry'
import { account } from '@senswap/sen-js'

import { useMint, usePool, useWallet } from 'senhub/providers'

const DEFAULT_INFO = {
  accountAddress: '',
  poolAddresses: [],
}

type MintSelection = {
  accountAddress?: string
  mintInfo?: TokenInfo
  poolAddress?: string
  poolAddresses: string[]
}

export const useMintSelection = (mintAddress: string): MintSelection => {
  const { wallet } = useWallet()
  const { tokenProvider } = useMint()
  const { pools } = usePool()
  const [selectionInfo, setSelectionInfo] =
    useState<MintSelection>(DEFAULT_INFO)

  const getSelectionInfo = useCallback(async () => {
    if (!account.isAddress(mintAddress)) return setSelectionInfo(DEFAULT_INFO)
    const mintInfo = await tokenProvider.findByAddress(mintAddress)
    const { splt } = window.sentre
    // get mint account
    const accountAddress = await splt.deriveAssociatedAddress(
      wallet.address,
      mintAddress,
    )
    // get pools
    const poolAddresses = Object.keys(pools).filter((poolAddress) => {
      const { mint_a, mint_b } = pools[poolAddress]
      return [mint_a, mint_b].includes(mintAddress)
    })
    setSelectionInfo({
      accountAddress,
      mintInfo,
      poolAddress: '',
      poolAddresses,
    })
  }, [mintAddress, pools, tokenProvider, wallet.address])

  useEffect(() => {
    getSelectionInfo()
  }, [getSelectionInfo])

  return selectionInfo
}
