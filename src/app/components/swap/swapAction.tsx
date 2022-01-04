import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { account, utils } from '@senswap/sen-js'

import { Button, Col, Row } from 'antd'
import IonIcon from 'shared/antd/ionicon'
import Ask from '../ask'
import Bid from '../bid'

import {
  buildPoolGraph,
  findAllRoute,
  findBestRouteFromAsk,
  findBestRouteFromBid,
  RouteTrace,
} from 'app/helper/router'
import { AppDispatch, AppState } from 'app/model'
import { updateAskData } from 'app/model/ask.controller'
import { updateBidData } from 'app/model/bid.controller'
import { RouteInfo, updateRoute } from 'app/model/route.controller'
import { usePool } from 'senhub/providers'
import { SenLpState } from 'app/constant/senLpState'

const SwapAction = ({ spacing = 12 }: { spacing?: number }) => {
  const dispatch = useDispatch<AppDispatch>()
  const [bestRoute, setBestRoute] = useState<RouteInfo>({
    hops: [],
    amounts: [],
    amount: BigInt(0),
  })
  const bidData = useSelector((state: AppState) => state.bid)
  const askData = useSelector((state: AppState) => state.ask)
  const { pools } = usePool()
  const { state } = useLocation<SenLpState>()
  const poolAdress = state?.poolAddress
  const originalRoute = state?.originalRoute

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

  /**
   * Find optimal route
   */
  const findRoute = useCallback(async () => {
    const {
      poolAddresses: bidPoolAddresses,
      mintInfo: bidMintInfo,
      amount: bidAmount,
      priority: bidPriority,
    } = bidData
    const {
      poolAddresses: askPoolAddresses,
      mintInfo: askMintInfo,
      amount: askAmount,
      priority: askPriority,
    } = askData
    const { address: bidMintAddress } = bidMintInfo || {}
    const bidPools = bidPoolAddresses.map((address) => ({
      address,
      ...pools[address],
    }))
    const { address: askMintAddress } = askMintInfo || {}
    const askPools = askPoolAddresses.map((address) => ({
      address,
      ...pools[address],
    }))
    let bestRoute: RouteInfo = { hops: [], amounts: [], amount: BigInt(0) }

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

    //when user select original route from senlp
    if (originalRoute)
      routes = routes.filter(
        (route) => route.pools.length === 1 && route.pools[0] === poolAdress,
      )

    if (askPriority < bidPriority) {
      bestRoute = await findBestRouteFromBid(pools, routes, bidData, askData)
    } else {
      bestRoute = await findBestRouteFromAsk(pools, routes, bidData, askData)
    }

    return setBestRoute(bestRoute)
  }, [askData, bidData, originalRoute, poolAdress, pools])

  const setRoute = useCallback(() => {
    const bidPriority = bidData.priority
    const askPriority = askData.priority
    if (askPriority < bidPriority) {
      dispatch(
        updateAskData({
          amount: utils.undecimalize(
            bestRoute.amount,
            askData.mintInfo?.decimals || 0,
          ),
        }),
      )
    }
    if (bidPriority < askPriority) {
      dispatch(
        updateBidData({
          amount: utils.undecimalize(
            bestRoute.amount,
            bidData.mintInfo?.decimals || 0,
          ),
        }),
      )
    }
    dispatch(updateRoute({ ...bestRoute }))
  }, [
    askData.priority,
    bestRoute,
    bidData.priority,
    dispatch,
    bidData.mintInfo?.decimals,
    askData.mintInfo?.decimals,
  ])

  useEffect(() => {
    setRoute()
  }, [setRoute])

  useEffect(() => {
    findRoute()
  }, [findRoute])

  return (
    <Row gutter={[spacing, spacing]} justify="center">
      <Col span={24}>
        <Bid />
      </Col>
      <Col>
        <Button
          size="small"
          icon={<IonIcon name="git-compare-outline" />}
          onClick={onSwitch}
        />
      </Col>
      <Col span={24}>
        <Ask />
      </Col>
    </Row>
  )
}

export default SwapAction
