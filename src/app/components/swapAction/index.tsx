import { useCallback, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { utils } from '@senswap/sen-js'
import { useWallet } from '@senhub/providers'

import { Button } from 'antd'

import { AppState, AppDispatch } from 'app/model'
import { explorer } from 'shared/util'
import { PriceImpact } from 'app/constant/swap'
import { SenLpState } from 'app/constant/senLpState'
import { useWrapSol } from './useWrapSol'
import { updateBidData } from 'app/model/bid.controller'
import { updateAskData } from 'app/model/ask.controller'
import { updateRoute } from 'app/model/route.controller'
import useSenSwap from './useSenSwap'
import { useDisabled } from './useDisabled'
// import useJupiterAggregator from './useJupiterAggregator'

const DECIMALS = BigInt(1000000000)

const SwapButton = ({
  onCallback = () => {},
  forceSwap = false,
}: {
  onCallback?: () => void
  forceSwap?: boolean
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const [loading, setLoading] = useState(false)
  const {
    route: { best, priceImpact, amount: bestAmount },
    bid: {
      amount: _bidAmount,
      mintInfo: { decimals: bidMintDecimals },
      priority: bidPriority,
    },
    ask: {
      amount: _askAmount,
      mintInfo: { decimals: askMintDecimals },
      priority: askPriority,
    },
    settings: { slippage, advanced },
  } = useSelector((state: AppState) => state)
  const {
    wallet: { address: walletAddress },
  } = useWallet()
  const { wrapAmount, wrapSol } = useWrapSol()
  const { state: senlpState } = useLocation<SenLpState>()
  const disabled = useDisabled()

  const bestRoute = useSenSwap(senlpState?.poolAddress)
  console.log(bestRoute)
  // const jupiter = useJupiterAggregator()
  // console.log(jupiter)

  const handleSwap = useCallback(async () => {
    const { swap, splt, wallet } = window.sentre
    if (!wallet) throw new Error('Wallet is not connected')
    // Synthetize routings
    const routingAddresses = await Promise.all(
      best.map(
        async ({
          srcMintAddress,
          dstMintAddress,
          poolData: { address: poolAddress },
        }) => {
          const srcAddress = await splt.deriveAssociatedAddress(
            walletAddress,
            srcMintAddress,
          )
          const dstAddress = await splt.deriveAssociatedAddress(
            walletAddress,
            dstMintAddress,
          )
          return {
            poolAddress: poolAddress,
            srcAddress: srcAddress,
            dstAddress: dstAddress,
          }
        },
      ),
    )
    // Compute limit
    const bidAmount = utils.decimalize(_bidAmount, bidMintDecimals)
    const askAmount = utils.decimalize(_askAmount, askMintDecimals)
    const limit =
      (askAmount * (DECIMALS - utils.decimalize(slippage, 9))) / DECIMALS
    // Execute swap
    return await swap.route(bidAmount, limit, routingAddresses, wallet)
  }, [
    best,
    bidMintDecimals,
    askMintDecimals,
    slippage,
    walletAddress,
    _bidAmount,
    _askAmount,
  ])

  const onSwap = async () => {
    try {
      setLoading(true)
      // check wrap sol
      if (wrapAmount) await wrapSol()

      const { txId } = await handleSwap()
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
