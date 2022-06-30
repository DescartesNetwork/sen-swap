import { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { Button } from 'antd'
import useJupiterAggregator from 'hooks/jupiter/useJupiterAggregator'

import { PlatformButtonProps } from './index'
import { AppDispatch } from 'model'
import { updateRoute } from 'model/route.controller'

let timeout: NodeJS.Timeout

const SwapButtonJup = ({
  loading,
  disabled,
  children,
  onSwap,
}: PlatformButtonProps) => {
  const { swap, bestRoute } = useJupiterAggregator()
  const dispatch = useDispatch<AppDispatch>()

  const setRoute = useCallback(() => {
    if (timeout) clearTimeout(timeout)
    setTimeout(() => {
      dispatch(updateRoute({ ...bestRoute }))
    }, 500)
  }, [bestRoute, dispatch])

  useEffect(() => {
    setRoute()
  }, [setRoute])

  return (
    <Button
      type="primary"
      onClick={() =>
        onSwap(() =>
          swap().then((e) => {
            return { txId: e.txId, dst: e.dstAddress }
          }),
        )
      }
      loading={loading}
      disabled={disabled}
      block
    >
      {children}
    </Button>
  )
}

export default SwapButtonJup
