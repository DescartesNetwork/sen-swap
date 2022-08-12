import { useSelector } from 'react-redux'
import { AppState } from 'model'

export const usePool = () => {
  const pools = useSelector((state: AppState) => state.pool)
  return { pools }
}
