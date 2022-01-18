import { useCallback, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { utils } from '@senswap/sen-js'

import { Button } from 'antd'

import { AppState, AppDispatch } from 'app/model'
import { explorer } from 'shared/util'
import { PriceImpact } from 'app/constant/swap'
import { SenLpState } from 'app/constant/senLpState'
import { updateBidData } from 'app/model/bid.controller'
import { updateAskData } from 'app/model/ask.controller'
import { updateRoute } from 'app/model/route.controller'
import { useWrapSol } from 'app/hooks/useWrapSol'
import { useDisabledSwap } from 'app/hooks/useDisabledSwap'
import { useSenSwapValidator } from 'app/hooks/senswap/useSenSwapValidator'
import useSenSwap from 'app/hooks/senswap'
import useJupiterAggregator from 'app/hooks/jupiter/useJupiterAggregator'

export type SwapButtonProps = {
  onCallback?: () => void
  forceSwap?: boolean
}

const SwapButton = ({
  onCallback = () => {},
  forceSwap = false,
}: SwapButtonProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const [loading, setLoading] = useState(false)
  const {
    route: { priceImpact, amount: bestAmount },
    bid: {
      mintInfo: { decimals: bidMintDecimals },
      priority: bidPriority,
    },
    ask: {
      mintInfo: { decimals: askMintDecimals },
      priority: askPriority,
    },
    settings: { advanced },
  } = useSelector((state: AppState) => state)

  const { wrapAmount, wrapSol } = useWrapSol()
  const { state: senlpState } = useLocation<SenLpState>()
  const disabled = useDisabledSwap()

  const validSenSwap = useSenSwapValidator()
  const senswap = useSenSwap(senlpState?.poolAddress)
  const jupiter = useJupiterAggregator()
  const { swap, bestRoute } = validSenSwap ? senswap : jupiter

  const onSwap = async () => {
    try {
      setLoading(true)
      // check wrap sol
      if (wrapAmount) await wrapSol()

      const { txId } = await swap()
      window.notify({
        type: 'success',
        description: 'Swap successfully. Click to view details.',
        onClick: () => window.open(explorer(txId), '_blank'),
      })
      return onCallback()
    } catch (er: any) {
      return window.notify({ type: 'error', description: er.message })
    } finally {
      return setLoading(false)
    }
  }

  const setRoute = useCallback(() => {
    if (askPriority < bidPriority) {
      dispatch(
        updateAskData({
          amount: utils.undecimalize(bestAmount, askMintDecimals),
        }),
      )
    }
    if (bidPriority < askPriority) {
      dispatch(
        updateBidData({
          amount: utils.undecimalize(bestAmount, bidMintDecimals),
        }),
      )
    }
    dispatch(updateRoute({ ...bestRoute }))
  }, [
    dispatch,
    bestAmount,
    bestRoute,
    bidPriority,
    bidMintDecimals,
    askPriority,
    askMintDecimals,
  ])

  useEffect(() => {
    setRoute()
  }, [setRoute])

  const tooHighImpact =
    !advanced && priceImpact > PriceImpact.acceptableSwap && !forceSwap

  return (
    <Button
      type="primary"
      onClick={onSwap}
      disabled={disabled || tooHighImpact}
      loading={loading}
      block
    >
      {tooHighImpact
        ? 'Too High Price Impact'
        : forceSwap
        ? 'Swap Anyway'
        : 'Swap'}
    </Button>
  )
}

export default SwapButton
