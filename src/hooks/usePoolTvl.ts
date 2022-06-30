import { useCallback, useEffect, useState } from 'react'
import { usePool } from '@sentre/senhub'

import { useMintTotalValue } from './useMintTotalValue'

// Refer: sen-lp
export const usePoolTvl = (poolAddress?: string) => {
  const { pools } = usePool()
  const [tvl, setTvl] = useState(0)
  const { getMintTotalValue } = useMintTotalValue()

  const getTvl = useCallback(
    async (poolAddress: string) => {
      const poolData = pools[poolAddress]
      if (!poolData) return 0
      const { reserve_a, reserve_b, mint_a, mint_b } = poolData
      const totalA = await getMintTotalValue({
        mintAddress: mint_a,
        amount: reserve_a,
      })
      const totalB = await getMintTotalValue({
        mintAddress: mint_b,
        amount: reserve_b,
      })
      return totalA + totalB
    },
    [getMintTotalValue, pools],
  )

  const updateTvl = useCallback(
    async (poolAddress?: string) => {
      if (!poolAddress) return setTvl(0)
      const poolTvl = await getTvl(poolAddress)
      setTvl(poolTvl)
    },
    [getTvl],
  )

  useEffect(() => {
    updateTvl(poolAddress)
  }, [updateTvl, poolAddress])

  return { tvl, getTvl }
}
