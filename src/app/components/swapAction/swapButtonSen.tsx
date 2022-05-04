import { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'

import { Button } from 'antd'
import { PlatformButtonProps } from './index'

import useSenSwap from 'app/hooks/senswap'
import { SenLpState } from 'app/constant/senLpState'
import { AppDispatch } from 'app/model'
import { setLoadingSenSwap, updateRoute } from 'app/model/route.controller'

let timeout: NodeJS.Timeout

const SwapButtonSen = ({
  loading,
  disabled,
  children,
  onSwap,
}: PlatformButtonProps) => {
  const { state: senlpState } = useLocation<SenLpState>()
  const dispatch = useDispatch<AppDispatch>()
  const { swap, bestRoute } = useSenSwap(senlpState?.poolAddress)

  const setRoute = useCallback(async () => {
    if (timeout) clearTimeout(timeout)
    await dispatch(updateRoute({ ...bestRoute }))
    setTimeout(() => {
      dispatch(
        setLoadingSenSwap({ loadingSenswap: false, loadingJupSwap: true }),
      )
    }, 500)
  }, [bestRoute, dispatch])

  useEffect(() => {
    setRoute()
  }, [setRoute])

  return (
    <Button
      type="primary"
      onClick={() => onSwap(swap)}
      loading={loading}
      disabled={disabled}
      block
    >
      {children}
    </Button>
  )
}

export default SwapButtonSen
