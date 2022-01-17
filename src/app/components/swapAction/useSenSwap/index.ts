import { useHandleSwap } from './useHandleSwap'
import { useBestRoute } from './useBestRoute'

const useSenSwap = (fixedPoolAddress?: string) => {
  const bestRoute = useBestRoute(fixedPoolAddress)
  const exchange = useHandleSwap()

  return { bestRoute, exchange }
}

export default useSenSwap
