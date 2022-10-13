import { useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { account, PoolData } from '@senswap/sen-js'
import { useJupiter } from '@jup-ag/react-hook'
import { Connection } from '@solana/web3.js'
import { rpc, util, useWalletAddress } from '@sentre/senhub'

import { AppDispatch, AppState } from 'model'
import {
  RouteState,
  setLoadingJupiterRoute,
  SwapPlatform,
} from 'model/route.controller'
import { RouteTrace } from 'helper/router'
import JupiterWalletWrapper from 'hooks/jupiter/jupiterWalletWrapper'
import { HopData } from 'components/preview'

const connection = new Connection(rpc)

const DEFAULT_DATA: RouteState = {
  platform: SwapPlatform.JupiterAggregator,
  best: [],
  amount: BigInt(0),
  priceImpact: 0,
}

let timeout: NodeJS.Timeout

const useJupiterAggregator = () => {
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
  } = useSelector((state: AppState) => state)
  const walletAddress = useWalletAddress()

  const amount = Number(bidAmount) * 10 ** bidDecimals
  const inputMint = useMemo(
    () =>
      util.isAddress(bidMintAddress)
        ? account.fromAddress(bidMintAddress)
        : undefined,
    [bidMintAddress],
  )
  const outputMint = useMemo(
    () =>
      util.isAddress(askMintAddress)
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
      sentre: { solana },
    } = window
    if (!solana || !util.isAddress(walletAddress))
      throw new Error('Wallet is not connected')
    if (!routes?.length) throw new Error('No available route')

    const wrappedWallet = new JupiterWalletWrapper(walletAddress, solana)
    const result: any = await exchange({
      wallet: wrappedWallet,
      routeInfo: routes[0],
      onTransaction: async (txid: string) => {
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
    dispatch(setLoadingJupiterRoute({ loadingJupSwap: loading }))
  }, [dispatch, loading])

  useEffect(() => {
    if (!!bidAmount && Number(bidAmount) > 0) {
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => {
        refresh()
      }, 1000)
    }
    // because refresh is not a useCallBack function. So not dependent refresh
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bidAmount])
  return { swap, bestRoute }
}

export default useJupiterAggregator
