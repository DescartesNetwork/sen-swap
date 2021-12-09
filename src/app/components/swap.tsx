import { useState, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { account } from '@senswap/sen-js'

import { Row, Col, Button } from 'antd'
import Bid from './bid'
import IonIcon from 'shared/antd/ionicon'
import Ask from './ask'

import {
  BestRouteInfo,
  buildPoolGraph,
  ExtendedPoolData,
  findAllRoute,
  findBestRouteFromAsk,
  findBestRouteFromBid,
  RouteTrace,
} from 'app/helper/router'
import { AppDispatch, AppState } from 'app/model'
import { usePool } from 'senhub/providers'
import { updateBidData } from 'app/model/bid.controller'
import { updateAskData } from 'app/model/ask.controller'
import SwapSettings from 'app/page/swap/swapSettings'
import { updateRouteInfo } from 'app/model/route.controller'

const Swap = ({
  onChange = () => {},
}: {
  onChange: (route: BestRouteInfo) => void
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const [bestRoute, setBestRoute] = useState(new BestRouteInfo())
  const bidData = useSelector((state: AppState) => state.bid)
  const askData = useSelector((state: AppState) => state.ask)
  const { advanced } = useSelector((state: AppState) => state.settings)
  const { pools } = usePool()
  /**
   * Switch tokens
   */
  const onSwitch = useCallback(async () => {
    const { amount: bidAmount, priority: bidPriority, ...bidRest } = bidData
    const { amount: askAmount, priority: askPriority, ...askRest } = askData
    const amount = bidPriority > askPriority ? bidAmount : askAmount
    const updateData = bidPriority > askPriority ? updateAskData : updateBidData
    await dispatch(updateBidData({ ...askRest, amount: '', reset: true }))
    await dispatch(updateAskData({ ...bidRest, amount: '', reset: true }))
    await dispatch(updateData({ amount, prioritized: true }))
  }, [dispatch, askData, bidData])

  const parsePools = useCallback(
    (
      poolAddress: string | undefined,
      poolAddresses: string[],
    ): ExtendedPoolData[] => {
      return account.isAddress(poolAddress)
        ? [
            {
              address: poolAddress,
              ...pools[poolAddress],
            },
          ]
        : poolAddresses.map((address) => ({ address, ...pools[address] }))
    },
    [pools],
  )

  /**
   * Find optimal route
   */
  const findRoute = useCallback(async () => {
    const {
      poolAddress: bidPoolAddress,
      poolAddresses: bidPoolAddresses,
      mintInfo: bidMintInfo,
      amount: bidAmount,
      priority: bidPriority,
    } = bidData
    const {
      poolAddress: askPoolAddress,
      poolAddresses: askPoolAddresses,
      mintInfo: askMintInfo,
      amount: askAmount,
      priority: askPriority,
    } = askData

    const { address: bidMintAddress } = bidMintInfo || {}
    const bidPools = parsePools(bidPoolAddress, bidPoolAddresses)
    const { address: askMintAddress } = askMintInfo || {}
    const askPools = parsePools(askPoolAddress, askPoolAddresses)
    let bestRoute = new BestRouteInfo()

    if (
      (!Number(bidAmount) && !Number(askAmount)) ||
      !account.isAddress(bidMintAddress) ||
      !account.isAddress(askMintAddress) ||
      !bidPools.length ||
      !askPools.length ||
      !bidMintInfo
    )
      return setBestRoute(bestRoute)
    // Use mode to find best route this mean the system find best route for end user.
    // the best route return a route that user can receive maximum ask amount when swap
    let routes = new Array<RouteTrace>()

    const pathTrace: RouteTrace = {
      mints: [bidMintAddress],
      pools: [],
    }
    const graph = buildPoolGraph(pools)
    findAllRoute(routes, graph, bidMintAddress, askMintAddress, pathTrace)
    // No available route
    if (!routes.length) return setBestRoute(bestRoute)
    // If advance is true this mean end user want to use manual mode.
    // They can select the pool of token pair to swap.
    if (advanced) {
      routes = routes.filter((route) => {
        const length = route.pools.length
        if (
          account.isAddress(bidPoolAddress) &&
          route.pools[0] !== bidPoolAddress
        )
          return false
        if (
          account.isAddress(askPoolAddress) &&
          route.pools[length - 1] !== askPoolAddress
        )
          return false
        return true
      })
    }

    if (askPriority < bidPriority) {
      bestRoute = await findBestRouteFromBid(pools, routes, bidData, askData)
    } else
      bestRoute = await findBestRouteFromAsk(pools, routes, bidData, askData)
    return setBestRoute(bestRoute)
  }, [advanced, askData, bidData, parsePools, pools])

  const updateRoute = useCallback(() => {
    const bidPriority = bidData.priority
    const askPriority = askData.priority
    if (askPriority < bidPriority) {
      dispatch(updateAskData({ amount: bestRoute.amount }))
    }
    if (bidPriority < askPriority) {
      dispatch(updateBidData({ amount: bestRoute.amount }))
    }
    onChange(bestRoute)
    dispatch(updateRouteInfo({ route: { ...bestRoute } }))
  }, [askData.priority, bestRoute, bidData.priority, dispatch, onChange])

  useEffect(() => {
    updateRoute()
  }, [updateRoute])

  useEffect(() => {
    findRoute()
  }, [findRoute])

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Row gutter={[8, 8]} justify="end" align="middle" wrap={false}>
          <Col>
            <SwapSettings />
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <Bid />
      </Col>
      <Col span={24}>
        <Row gutter={[8, 8]} justify="center">
          <Col>
            <Button
              size="small"
              icon={<IonIcon name="git-compare-outline" />}
              onClick={onSwitch}
            />
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <Ask />
      </Col>
    </Row>
  )
}

export default Swap
