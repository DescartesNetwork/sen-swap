import { account, PoolData } from '@senswap/sen-js'

import { curve } from './oracle'
import { State as BidState } from 'app/model/bid.controller'
import { State as AskState } from 'app/model/ask.controller'
import { inverseCurve } from './oracle'
import { HopData } from 'app/components/preview/hop'
import TokenProvider from 'os/providers/tokenProvider'

const POOL_ACTIVITY_STATUS = 1
const LIMIT_POOL_IN_ROUTE = 3
const TOKEN_PROVIDER = new TokenProvider()

export type ExtendedPoolData = PoolData & { address: string }
export type GraphPool = Map<string, Map<string, PoolData>>
export type RouteTrace = {
  pools: string[]
  mints: string[]
}
export class BestRouteInfo {
  hops: HopData[] = []
  amounts: string[] = []
  amount: string = ''
}

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
export const findAllRoute = (
  routes: Array<RouteTrace>,
  graph: GraphPool,
  startMint: string,
  endMint: string,
  pathTrace: RouteTrace,
) => {
  const { pools, mints } = pathTrace
  if (pools.length === LIMIT_POOL_IN_ROUTE) return
  const mapPool = graph.get(startMint)
  mapPool?.forEach((pool, poolAddress) => {
    if (pools.includes(poolAddress)) return

    let { mint_b: askMint } = pool
    if (pool.mint_a !== startMint) {
      askMint = pool.mint_a
    }
    if (mints.includes(askMint)) return

    const newPathTrace = {
      pools: [...pools, poolAddress],
      mints: [...mints, askMint],
    }
    if (askMint === endMint) {
      routes.push(newPathTrace)
      return
    }
    findAllRoute(routes, graph, askMint, endMint, newPathTrace)
  })
}

const parseHops = async (
  mapPoolData: Record<string, PoolData>,
  pools: string[],
  bidData: BidState,
  askData: AskState,
): Promise<HopData[]> => {
  const bidMintAddress = bidData.mintInfo?.address
  const askMintAddress = askData.mintInfo?.address
  if (!account.isAddress(bidMintAddress) || !account.isAddress(askMintAddress))
    return []

  const hops: HopData[] = []
  let srcMintAddress = bidMintAddress
  let dstMintAddress = ''
  for (const poolAddress of pools) {
    const poolData = mapPoolData[poolAddress]
    const { mint_a, mint_b } = poolData

    if (srcMintAddress !== mint_a && srcMintAddress !== mint_b) return []

    dstMintAddress = srcMintAddress === mint_a ? mint_b : mint_a
    const srcMintInfo = await TOKEN_PROVIDER.findByAddress(srcMintAddress)
    const dstMintInfo = await TOKEN_PROVIDER.findByAddress(dstMintAddress)
    if (!srcMintInfo || !dstMintInfo) return []

    const hop: HopData = {
      poolData: { address: poolAddress, ...poolData },
      srcMintInfo,
      dstMintInfo,
    }
    srcMintAddress = dstMintAddress
    hops.push(hop)
  }
  return hops
}

export const findBestRouteFromBid = async (
  mapPoolData: Record<string, PoolData>,
  routes: RouteTrace[],
  bidData: BidState,
  askData: AskState,
): Promise<BestRouteInfo> => {
  let bestRoute = new BestRouteInfo()
  for (let route of routes) {
    const hops = await parseHops(mapPoolData, route.pools, bidData, askData)
    let amount = bidData.amount
    const amounts = new Array<string>()

    hops.forEach((hop) => {
      amounts.push(amount)
      amount = curve(amount, hop)
    })
    const maxAskAmount = Number(bestRoute.amount)
    if (Number(amount) > maxAskAmount) {
      bestRoute = {
        hops,
        amounts,
        amount,
      }
    }
  }
  return bestRoute
}

export const findBestRouteFromAsk = async (
  mapPoolData: Record<string, PoolData>,
  routes: RouteTrace[],
  bidData: BidState,
  askData: AskState,
): Promise<BestRouteInfo> => {
  let bestRoute = new BestRouteInfo()
  for (let route of routes) {
    const hops = await parseHops(mapPoolData, route.pools, bidData, askData)
    const reversedHops = [...hops].reverse()
    let amount = askData.amount
    const amounts = new Array<string>()

    for (const reversedHop of reversedHops) {
      amount = inverseCurve(amount, reversedHop)
      if (Number(amount) < 0) break
      amounts.unshift(amount)
    }
    if (Number(amount) < 0) continue

    const minBidAmount = Number(bestRoute.amount)
    if (!minBidAmount || Number(amount) < minBidAmount) {
      bestRoute = {
        hops,
        amounts,
        amount,
      }
    }
  }
  return bestRoute
}
