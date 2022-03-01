import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Col, Row } from 'antd'
import IonIcon from 'shared/antd/ionicon'
import Ask from '../ask'
import Bid from '../bid'

import { AppDispatch, AppState } from 'app/model'
import { updateAskData } from 'app/model/ask.controller'
import { updateBidData } from 'app/model/bid.controller'

const SwapInput = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { bid: bidData, ask: askData } = useSelector((state: AppState) => state)

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
