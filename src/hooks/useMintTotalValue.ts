import { useCallback } from 'react'
import { Swap, utils } from '@senswap/sen-js'
import { tokenProvider, useGetMintData } from '@sentre/senhub'
import { util } from '@sentre/senhub'

import { usePool } from 'hooks/usePool'

// Refer: sen-lp
export const useMintTotalValue = () => {
  const { pools } = usePool()
  const getMint = useGetMintData()

  const getTokenUsd = useCallback(
    async (mintAddress: string, amount: bigint) => {
      try {
        const tokenInfo = await tokenProvider.findByAddress(mintAddress)
        const ticket = tokenInfo?.extensions?.coingeckoId
        if (!ticket) throw new Error('Cant not find coingeckoId')

        const cgkData = await util.fetchCGK(ticket)
        return (
          Number(utils.undecimalize(amount, tokenInfo.decimals)) * cgkData.price
        )
      } catch (error) {
        return 0
      }
    },
    [],
  )

  const getMintTotalValue = useCallback(
    async ({
      mintAddress,
      amount,
    }: {
      mintAddress: string
      amount: bigint
    }) => {
      if (!amount) return 0
      const tokenInfo = await tokenProvider.findByAddress(mintAddress)
      if (tokenInfo) return getTokenUsd(mintAddress, amount)

      // Get Mint Lpt total value
      const poolData = Object.values(pools).find(
        (pool) => pool.mint_lpt === mintAddress,
      )
      if (!poolData) return 0
      const { reserve_a, reserve_b, mint_a, mint_b } = poolData
      if (reserve_a * reserve_b === BigInt(0)) return 0
      const {
        [mintAddress]: { supply },
      } = (await getMint({ mintAddress })) || {}
      const { deltaA, deltaB } = Swap.oracle.withdraw(
        amount,
        supply,
        reserve_a,
        reserve_b,
      )
      const balanceA: number = await getMintTotalValue({
        mintAddress: mint_a,
        amount: deltaA,
      })
      const balanceB: number = await getMintTotalValue({
        mintAddress: mint_b,
        amount: deltaB,
      })
      return balanceA + balanceB
    },
    [getMint, getTokenUsd, pools],
  )
  return { getMintTotalValue }
}
