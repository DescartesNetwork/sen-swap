import { account, PoolData, utils } from '@senswap/sen-js'

import { curve } from './oracle'
import { State as BidState } from 'app/model/bid.controller'
import { State as AskState } from 'app/model/ask.controller'
import { inverseCurve } from './oracle'
import { HopData } from 'app/components/preview/index'
import { RouteInfo } from 'app/model/route.controller'

const POOL_ACTIVITY_STATUS = 1
const LIMIT_POOL_IN_ROUTE = 3

export type ExtendedPoolData = PoolData & { address: string }
export type GraphPool = Map<string, Map<string, PoolData>>
export type RouteTrace = {
  pools: string[]
  mints: string[]
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
  bidMintAddress: string,
  askMintAddress: string,
  pathTrace?: RouteTrace,
) => {
  const { pools, mints } = pathTrace || {
    mints: [bidMintAddress],
    pools: [],
  }
  if (pools.length === LIMIT_POOL_IN_ROUTE) return
  const mapPool = graph.get(bidMintAddress)
  mapPool?.forEach((pool, poolAddress) => {
    if (pools.includes(poolAddress)) return

    const srcMintAddress = bidMintAddress
    const dstMintAddress =
      srcMintAddress === pool.mint_a ? pool.mint_b : pool.mint_a
    if (mints.includes(dstMintAddress)) return

    const newPathTrace = {
      pools: [...pools, poolAddress],
      mints: [...mints, dstMintAddress],
    }
    if (dstMintAddress === askMintAddress) return routes.push(newPathTrace)
    findAllRoute(routes, graph, dstMintAddress, askMintAddress, newPathTrace)
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
    const hop: HopData = {
      poolData: { address: poolAddress, ...poolData },
      srcMintAddress,
      dstMintAddress,
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
): Promise<RouteInfo> => {
  let bestRoute: RouteInfo = { hops: [], amounts: [], amount: BigInt(0) }
  for (let route of routes) {
    const hops = await parseHops(mapPoolData, route.pools, bidData, askData)
    if (!hops.length) continue
    let amount = utils.decimalize(bidData.amount, bidData.mintInfo.decimals)
    const amounts = new Array<bigint>()

    hops.forEach((hop) => {
      amounts.push(amount)
      amount = curve(amount, hop)
    })
    const maxAskAmount = bestRoute.amount
    if (amount > maxAskAmount) bestRoute = { hops, amounts, amount }
  }
  return bestRoute
}

export const findBestRouteFromAsk = async (
  mapPoolData: Record<string, PoolData>,
  routes: RouteTrace[],
  bidData: BidState,
  askData: AskState,
): Promise<RouteInfo> => {
  let bestRoute: RouteInfo = { hops: [], amounts: [], amount: BigInt(0) }
  for (let route of routes) {
    const hops = await parseHops(mapPoolData, route.pools, bidData, askData)
    if (!hops.length) continue
    const reversedHops = [...hops].reverse()
    let amount = utils.decimalize(askData.amount, askData.mintInfo.decimals)
    const amounts = new Array<bigint>()

    for (const reversedHop of reversedHops) {
      amount = inverseCurve(amount, reversedHop)
      if (amount <= BigInt(0)) break
      amounts.unshift(amount)
    }
    if (amount <= BigInt(0)) continue
    const minBidAmount = bestRoute.amount
    if (amount < minBidAmount || !minBidAmount)
      bestRoute = { hops, amounts, amount }
  }
  return bestRoute
}
