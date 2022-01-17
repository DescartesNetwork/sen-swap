import { useHandleSwap } from './useHandleSwap'
import { useBestRoute } from './useBestRoute'

const useSenSwap = (fixedPoolAddress?: string) => {
  const bestRoute = useBestRoute(fixedPoolAddress)
  const handleSwap = useHandleSwap()

  return { bestRoute, handleSwap }
}

export default useSenSwap
