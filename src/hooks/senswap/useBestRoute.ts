import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { account, PoolData } from '@senswap/sen-js'

import { AppState } from 'model'
import { RouteState, SwapPlatform } from 'model/route.controller'
import {
  buildPoolGraph,
  findAllRoutes,
  findBestRouteFromAsk,
  findBestRouteFromBid,
} from 'helper/router'
import { usePoolTvl } from '../usePoolTvl'
import { usePool } from 'hooks/usePool'

const MIN_TVL = 1000 // $USD

export const useBestRoute = (fixedPoolAddress?: string) => {
  const [bestRoute, setBestRoute] = useState<RouteState>({
    platform: SwapPlatform.SenSwap,
    best: [],
    amount: BigInt(0),
    priceImpact: 0,
  })
  const { bid: bidData, ask: askData } = useSelector((state: AppState) => state)
  const { pools } = usePool()
  const { getTvl } = usePoolTvl()
  /**
   * Find optimal route
   */
  const findBestRoute = useCallback(async () => {
    const {
      poolAddresses: bidPoolAddresses,
      mintInfo: { address: bidMintAddress },
      amount: bidAmount,
      priority: bidPriority,
    } = bidData
    const {
      poolAddresses: askPoolAddresses,
      mintInfo: { address: askMintAddress },
      amount: askAmount,
      priority: askPriority,
    } = askData

    // Initialize an instance for the best route
    // The best route return a route that user can receive maximum ask amount when swap
    let bestRoute: RouteState = {
      platform: SwapPlatform.SenSwap,
      best: [],
      amount: BigInt(0),
      priceImpact: 0,
    }
    // Return empty default
    if (
      (!Number(bidAmount) && !Number(askAmount)) ||
      !account.isAddress(bidMintAddress) ||
      !account.isAddress(askMintAddress) ||
      !bidPoolAddresses.length ||
      !askPoolAddresses.length ||
      bidMintAddress === askMintAddress
    )
      return setBestRoute(bestRoute)
    // filter pool tvl
    let filteredPool: Record<string, PoolData> = {}
    await Promise.all(
      Object.keys(pools).map(async (pool) => {
        let tvl = await getTvl(pool)
        if (tvl < MIN_TVL) return
        filteredPool[pool] = pools[pool]
      }),
    )

    // All possible routes
    let allRoutes = findAllRoutes(
      buildPoolGraph(filteredPool),
      bidMintAddress,
      askMintAddress,
    )
    // No available route
    if (!allRoutes.length) return setBestRoute(bestRoute)
    // When user select original route from senlp
    if (account.isAddress(fixedPoolAddress))
      allRoutes = allRoutes.filter(
        (route) =>
          route.length === 1 && route[0].poolData.address === fixedPoolAddress,
      )

    if (askPriority < bidPriority)
      bestRoute = findBestRouteFromBid(allRoutes, bidData)
    else bestRoute = findBestRouteFromAsk(allRoutes, askData)
    return setBestRoute(bestRoute)
  }, [askData, bidData, fixedPoolAddress, getTvl, pools])

  useEffect(() => {
    findBestRoute()
  }, [findBestRoute])

  return bestRoute
}
