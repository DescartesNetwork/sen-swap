import { useHandleSwap } from './useHandleSwap'
import { useBestRoute } from './useBestRoute'

const useSenSwap = (fixedPoolAddress?: string) => {
  const bestRoute = useBestRoute(fixedPoolAddress)
  const swap = useHandleSwap()

  return { bestRoute, swap }
}

export default useSenSwap
