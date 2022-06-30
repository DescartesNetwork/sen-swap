import { PoolData, utils } from '@senswap/sen-js'

import { curve, slippage } from './oracle'
import { BidState } from 'model/bid.controller'
import { AskState } from 'model/ask.controller'
import { inverseCurve } from './oracle'
import { HopData } from 'components/preview/index'
import { RouteState, SwapPlatform } from 'model/route.controller'

const PRECISION = 9
const POOL_ACTIVITY_STATUS = 1
const LIMIT_POOL_IN_ROUTE = 3

export type GraphPool = Map<string, Map<string, PoolData>>
export type RouteTrace = HopData[]

/**
 * Extract reserve from pool data
 * @param extractReserve
 * @param poolData
 * @returns
 */
export const extractReserve = (
  mintAddress: string,
  poolData: PoolData,
): bigint => {
  const { mint_a, mint_b, reserve_a, reserve_b } = poolData
  if (mintAddress === mint_a) return reserve_a
  if (mintAddress === mint_b) return reserve_b
  throw new Error('Cannot find reserves')
}

/**
 *
 * @param param0
 * @param param1
 * @returns
 */
type Point = { point: bigint }
export const pointSorting = (
  { point: firstPoint }: Point,
  { point: secondPoint }: Point,
) => {
  if (firstPoint < secondPoint) return 1
  if (firstPoint > secondPoint) return -1
  return 0
}

/**
 * Calculate price impact
 * @param best
 * @param bid
 * @param ask
 * @returns
 */
export const calcPriceImpact = (best: RouteTrace, bidAmount: bigint) => {
  if (!bidAmount) return 0
  let srcAmount = bidAmount
  let p = 1
  best.forEach((hopData) => {
    const s = Number(
      utils.undecimalize(slippage(srcAmount, hopData), PRECISION),
    )
    p = p * (1 - s)
    const dstAmount = curve(srcAmount, hopData)
    srcAmount = dstAmount
  })

  return 1 - p
}

export const buildPoolGraph = (pools: Record<string, PoolData>): GraphPool => {
  const graph = new Map<
    /*mint_address*/ string,
    Map</*pool_address*/ string, PoolData>
  >()
  for (const poolAddress in pools) {
    const pool = pools[poolAddress]
    if (pool?.state !== POOL_ACTIVITY_STATUS) continue
    const mints = [pool.mint_a, pool.mint_b]
    mints.forEach((mint) => {
      if (!graph.has(mint)) graph.set(mint, new Map<string, PoolData>())
      graph.get(mint)?.set(poolAddress, pool)
    })
  }
  return graph
}

// because of Solana is limiting the number of calculation unit, so the system
// must limit the list pool of root. Currently, the system set 3 pools in route
export const findAllRoutes = (
  graph: GraphPool,
  bidMintAddress: string,
  askMintAddress: string,
  deep = 0,
) => {
  const routes: RouteTrace[] = []
  const clonedGraph = new Map(graph)
  const pools = graph.get(bidMintAddress)

  // Too deep
  if (deep >= LIMIT_POOL_IN_ROUTE) return routes
  clonedGraph.delete(bidMintAddress)
  pools?.forEach((poolData, poolAddress) => {
    // Build sub params
    const srcMintAddress = bidMintAddress
    const dstMintAddress =
      srcMintAddress === poolData.mint_a ? poolData.mint_b : poolData.mint_a
    const hop: HopData = {
      srcMintAddress,
      dstMintAddress,
      poolData: { ...poolData, address: poolAddress },
    }
    // Termination
    if (dstMintAddress === askMintAddress) return routes.push([hop])
    // Recursive call
    const subRoutes = findAllRoutes(
      clonedGraph,
      dstMintAddress,
      askMintAddress,
      deep + 1,
    )
    subRoutes.forEach((route) => routes.push([hop, ...route]))
  })

  return routes
}

export const findBestRouteFromBid = (
  routes: RouteTrace[],
  bidState: BidState,
): RouteState => {
  const { amount: bidAmount, mintInfo } = bidState
  let bestRoute: RouteState = {
    platform: SwapPlatform.SenSwap,
    best: [],
    amount: BigInt(0),
    priceImpact: 0,
  }
  routes.forEach((route) => {
    let amount = utils.decimalize(bidAmount, mintInfo.decimals)
    route.forEach((hop) => {
      amount = curve(amount, hop)
    })
    const maxAskAmount = bestRoute.amount
    if (amount > maxAskAmount)
      bestRoute = {
        platform: SwapPlatform.SenSwap,
        best: route,
        amount,
        priceImpact: 0,
      }
  })
  const amount = utils.decimalize(bidAmount, mintInfo.decimals)
  bestRoute.priceImpact = calcPriceImpact(bestRoute.best, amount)
  return bestRoute
}

export const findBestRouteFromAsk = (
  routes: RouteTrace[],
  { amount: askAmount, mintInfo }: AskState,
): RouteState => {
  let bestRoute: RouteState = {
    platform: SwapPlatform.SenSwap,
    best: [],
    amount: BigInt(0),
    priceImpact: 0,
  }
  for (const route of routes) {
    const reversedRoute = [...route].reverse()
    let amount = utils.decimalize(askAmount, mintInfo.decimals)

    for (const hop of reversedRoute) {
      amount = inverseCurve(amount, hop)
      if (amount <= BigInt(0)) break
    }
    if (amount <= BigInt(0)) continue
    const minBidAmount = bestRoute.amount
    if (amount < minBidAmount || !minBidAmount)
      bestRoute = {
        platform: SwapPlatform.SenSwap,
        best: route,
        amount,
        priceImpact: 0,
      }
  }
  bestRoute.priceImpact = calcPriceImpact(bestRoute.best, bestRoute.amount)
  return bestRoute
}
