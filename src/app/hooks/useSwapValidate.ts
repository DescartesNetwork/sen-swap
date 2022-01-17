import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { AppState } from 'app/model'
import { usePoolTvl } from 'app/hooks/usePoolTvl'

const MIN_TVL = 1000

export const useSwapValidate = () => {
  const {
    route: { best },
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
  }, [getTvl, best])

  const validate = useCallback(async () => {
    // check hops length
    if (!best.length) return setValid(false)
    // check pool's Liquidity >= MIN_TVL
    const validLiquidity = await checkLiquidity()
    if (!validLiquidity) return setValid(false)

    return setValid(true)
  }, [checkLiquidity, best])

  useEffect(() => {
    validate()
  }, [validate])

  return { valid }
}
