import { RouteState } from 'app/model/route.controller'
import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { AppState } from 'app/model'
import { usePoolTvl } from 'app/hooks/usePoolTvl'

const MIN_TVL = 1000 // $USD

export const useSenSwapValidator = ({ best }: RouteState) => {
  const {
    bid: { amount: bidAmount },
    ask: { amount: askAmount },
  } = useSelector((state: AppState) => state)
  const [valid, setValid] = useState(false)
  const { getTvl } = usePoolTvl()

  const checkLiquidity = useCallback(async () => {
    for (const hop of best) {
      const poolAddr = hop.poolData.address
      const tvl = await getTvl(poolAddr)
      if (tvl < MIN_TVL) return false
    }
    return true
  }, [best, getTvl])

  const validate = useCallback(async () => {
    if (!Number(bidAmount) && !Number(askAmount)) return setValid(true)
    // Check hops length
    if (!best.length) return setValid(false)
    // Check pool's Liquidity >= MIN_TVL
    const validLiquidity = await checkLiquidity()
    if (!validLiquidity) return setValid(false)

    return setValid(true)
  }, [checkLiquidity, best, askAmount, bidAmount])

  useEffect(() => {
    validate()
  }, [validate])

  return valid
}
