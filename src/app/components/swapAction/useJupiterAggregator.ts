import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { account, PoolData } from '@senswap/sen-js'
import { useJupiter } from '@jup-ag/react-hook'
import { Connection } from '@solana/web3.js'

import { AppState } from 'app/model'
import configs from 'app/configs'
import { RouteState, SwapPlatform } from 'app/model/route.controller'
import { RouteTrace } from 'app/helper/router'
import { HopData } from '../preview'
import JupiterWalletWrapper from './jupiterWalletWrapper'
import { useWallet } from '@senhub/providers'

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
  const {
    bid: {
      mintInfo: { address: bidMintAddress },
      amount: bidAmount,
    },
    ask: {
      mintInfo: { address: askMintAddress },
    },
    settings: { slippage },
  } = useSelector((state: AppState) => state)
  const {
    wallet: { address: walletAddress },
  } = useWallet()

  const amount = Number(bidAmount) * 10 ** 6
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
  const { exchange, routes } = useJupiter({
    amount,
    inputMint,
    outputMint,
    slippage: slippage * 100,
    debounceTime: 250,
  })

  if (!routes?.length)
    return {
      swap: () => {
        throw new Error('No available route')
      },
      bestRoutes: { ...DEFAULT_DATA },
    }

  const { outAmount, priceImpactPct, marketInfos } = routes[0]
  const best: RouteTrace = marketInfos.map(({ inputMint, outputMint }) => {
    const hop: HopData = {
      poolData: {} as PoolData & { address: string }, // dummy pool data
      srcMintAddress: inputMint.toBase58(),
      dstMintAddress: outputMint.toBase58(),
    }
    return hop
  })
  const bestRoute: RouteState = {
    platform: SwapPlatform.JupiterAggregator,
    amount: BigInt(outAmount),
    priceImpact: priceImpactPct,
    best,
  }

  const swap = async () => {
    const {
      sentre: { wallet },
    } = window
    if (!wallet || !account.isAddress(walletAddress))
      throw new Error('Wallet is not connected')
    const wrappedWallet = new JupiterWalletWrapper(walletAddress, wallet)

    const result = await exchange({
      wallet: wrappedWallet,
      route: routes[0],
      confirmationWaiterFactory: async (txid) => {
        await connection.confirmTransaction(txid)
        return await connection.getTransaction(txid, {
          commitment: 'confirmed',
        })
      },
    })
    const { txId, outputAddress } = { txId: '', outputAddress: '', ...result }
    return { txId, dstAddress: outputAddress }
  }

  return { swap, bestRoute }
}

export default useJupiterAggregator
