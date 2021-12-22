import { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { Row, Col } from 'antd'
import SwapChart from './chart'
import Swap from './swap'
import History from './history'

import 'app/static/styles/index.less'
import { usePool } from 'senhub/providers'
import { useMintSelection } from 'app/components/hooks/useMintSelection'
import { AppDispatch } from 'app/model'
import { updateBidData } from 'app/model/bid.controller'
import { updateAskData } from 'app/model/ask.controller'

const Page = () => {
  const { pools } = usePool()
  const dispatch = useDispatch<AppDispatch>()
  const [bid, setBid] = useState('')
  const [ask, setAsk] = useState('')
  const isBestRoute = true
  const mintAddress = '7SfA8UuMAr3QFyB24hwhapwQhtNXwN6ap1kchmedNgQm'

  const checkIsBestRoute = useCallback(() => {
    if (isBestRoute) return
    const poolData = pools[mintAddress]
    if (!poolData) return
    setBid(poolData?.mint_a)
    setAsk(poolData?.mint_b)
  }, [isBestRoute, pools])

  useEffect(() => {
    checkIsBestRoute()
  }, [checkIsBestRoute])

  const bidData = useMintSelection(bid)
  const askData = useMintSelection(ask)

  useEffect(() => {
    if (!bidData.accountAddress || !askData.accountAddress) return
    // dispatch(updateBidData(bidData))

    dispatch(updateBidData(bidData))
    dispatch(updateAskData(askData))
  }, [askData, bidData, dispatch])

  return (
    <Row gutter={[24, 24]}>
      <Col lg={8} md={12} xs={24}>
        <Swap />
      </Col>
      <Col lg={16} md={12} xs={24}>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <SwapChart />
          </Col>
          <Col span={24}>
            <History />
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default Page
