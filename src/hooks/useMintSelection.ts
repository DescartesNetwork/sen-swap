import { useCallback, useEffect, useState } from 'react'
import { tokenProvider, useWalletAddress, util } from '@sentre/senhub'

import { SelectionInfo } from 'components/selection/mintSelection'
import { usePool } from 'hooks/usePool'

const DEFAULT_INFO = {
  accountAddress: '',
  poolAddresses: [],
}

type MintSelection = SelectionInfo & {
  accountAddress?: string
}

export const useMintSelection = (mintAddress: string): MintSelection => {
  const { pools } = usePool()
  const walletAddress = useWalletAddress()
  const [selectionInfo, setSelectionInfo] =
    useState<MintSelection>(DEFAULT_INFO)

  const getSelectionInfo = useCallback(async () => {
    if (!util.isAddress(mintAddress) || !Object.keys(pools).length)
      return setSelectionInfo(DEFAULT_INFO)

    const mintInfo = await tokenProvider.findByAddress(mintAddress)
    if (!mintInfo) return setSelectionInfo(DEFAULT_INFO)
    const { splt } = window.sentre
    // get mint account
    const accountAddress = await splt.deriveAssociatedAddress(
      walletAddress,
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
      poolAddresses,
    })
  }, [mintAddress, pools, walletAddress])

  useEffect(() => {
    getSelectionInfo()
  }, [getSelectionInfo])

  return selectionInfo
}
