import { AppState } from 'model'
import { useSelector } from 'react-redux'

export const usePool = () => {
  const pools = useSelector((state: AppState) => state.pools)
  return { pools }
}
