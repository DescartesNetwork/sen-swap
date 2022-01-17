import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { utils } from '@senswap/sen-js'

import { Button, Col, Row } from 'antd'
import IonIcon from 'shared/antd/ionicon'
import Ask from '../ask'
import Bid from '../bid'

import { AppDispatch, AppState } from 'app/model'
import { updateAskData } from 'app/model/ask.controller'
import { updateBidData } from 'app/model/bid.controller'
import { updateRoute } from 'app/model/route.controller'
import { SenLpState } from 'app/constant/senLpState'
import useJupiterAggregator from './useJupiterAggregator'
import useSenSwap from './useSenSwap'

const SwapInput = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { bid: bidData, ask: askData } = useSelector((state: AppState) => state)
  const { state: senlpState } = useLocation<SenLpState>()

  const bestRoute = useSenSwap(senlpState?.poolAddress)
  const jupiter = useJupiterAggregator()
  console.log(jupiter)

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

  const setRoute = useCallback(() => {
    const bidPriority = bidData.priority
    const askPriority = askData.priority
    if (askPriority < bidPriority) {
      dispatch(
        updateAskData({
          amount: utils.undecimalize(
            bestRoute.amount,
            askData.mintInfo.decimals,
          ),
        }),
      )
    }
    if (bidPriority < askPriority) {
      dispatch(
        updateBidData({
          amount: utils.undecimalize(
            bestRoute.amount,
            bidData.mintInfo.decimals,
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

  return (
    <Row gutter={[12, 12]} justify="center">
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

export default SwapInput
