import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { account, PoolData } from '@senswap/sen-js'
import { useJupiter } from '@jup-ag/react-hook'
import { Connection } from '@solana/web3.js'

import configs from 'app/configs'
import { AppDispatch, AppState } from 'app/model'
import {
  RouteState,
  setLoadingJupiterRoute,
  SwapPlatform,
} from 'app/model/route.controller'
import { RouteTrace } from 'app/helper/router'

import JupiterWalletWrapper from 'app/hooks/jupiter/jupiterWalletWrapper'
import { useWallet } from '@senhub/providers'
import { HopData } from 'app/components/preview'

const {
  sol: { node },
} = configs
const connection = new Connection(node)

const DEFAULT_DATA: RouteState = {
  platform: SwapPlatform.JupiterAggregator,
  best: [],
  amount: BigInt(0),
  priceImpact: 0,
}

const useJupiterAggregator = () => {
  const [acceptableRefresh, setAcceptableRefresh] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const {
    bid: {
      mintInfo: { address: bidMintAddress, decimals: bidDecimals },
      amount: bidAmount,
    },
    ask: {
      mintInfo: { address: askMintAddress },
    },
    settings: { slippage },
    route: { loadingJubRoute },
  } = useSelector((state: AppState) => state)
  const {
    wallet: { address: walletAddress },
  } = useWallet()

  const amount = Number(bidAmount) * 10 ** bidDecimals
  const inputMint = useMemo(
    () =>
      account.isAddress(bidMintAddress)
        ? account.fromAddress(bidMintAddress)
        : undefined,
    [bidMintAddress],
  )
  const outputMint = useMemo(
    () =>
      account.isAddress(askMintAddress)
        ? account.fromAddress(askMintAddress)
        : undefined,
    [askMintAddress],
  )

  // Jupiter Aggregator
  const { exchange, routes, loading, refresh } = useJupiter({
    amount,
    inputMint,
    outputMint,
    slippage: slippage * 100,
    debounceTime: 250,
  })

  const swap = useCallback(async () => {
    const {
      sentre: { wallet },
    } = window
    if (!wallet || !account.isAddress(walletAddress))
      throw new Error('Wallet is not connected')
    if (!routes?.length) throw new Error('No available route')

    const wrappedWallet = new JupiterWalletWrapper(walletAddress, wallet)
    const result: any = await exchange({
      wallet: wrappedWallet,
      route: routes[0],
      confirmationWaiterFactory: async (txid) => {
        await connection.confirmTransaction(txid, 'confirmed')
        return await connection.getTransaction(txid, {
          commitment: 'confirmed',
        })
      },
    })
    if (result.error) throw new Error(result.error?.message || 'Unknown Error')
    const { txid, outputAddress } = result
    return { txId: txid, dstAddress: outputAddress }
  }, [exchange, routes, walletAddress])

  const bestRoute: RouteState = useMemo(() => {
    if (!routes?.length) return { ...DEFAULT_DATA }
    const { outAmount, priceImpactPct, marketInfos } = routes[0]
    const best: RouteTrace = marketInfos.map(({ inputMint, outputMint }) => {
      const hop: HopData = {
        poolData: {} as PoolData & { address: string }, // dummy pool data
        srcMintAddress: inputMint.toBase58(),
        dstMintAddress: outputMint.toBase58(),
      }
      return hop
    })
    return {
      platform: SwapPlatform.JupiterAggregator,
      amount: BigInt(outAmount),
      priceImpact: priceImpactPct,
      best,
    }
  }, [routes])

  useEffect(() => {
    if (loading !== loadingJubRoute)
      dispatch(setLoadingJupiterRoute({ loadingJubRoute: loading }))
  }, [dispatch, loading, loadingJubRoute])

  useEffect(() => {
    if (!!bidAmount && Number(bidAmount) > 0) return setAcceptableRefresh(true)
  }, [bidAmount])

  useEffect(() => {
    if (!acceptableRefresh) return
    setAcceptableRefresh(false)
    return refresh()
  }, [refresh, bidAmount, loadingJubRoute, acceptableRefresh])

  return { swap, bestRoute }
}

export default useJupiterAggregator
