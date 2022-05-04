import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { account } from '@senswap/sen-js'
import { usePool, useWallet } from '@senhub/providers'
import { JupiterProvider } from '@jup-ag/react-hook'
import { Connection, PublicKey } from '@solana/web3.js'

import { Row, Col } from 'antd'
import SwapChart from './chart'
import Swap from './swap'
import History from './history'

import { useMintSelection } from 'app/hooks/useMintSelection'
import { AppDispatch, AppState } from 'app/model'
import { updateBidData } from 'app/model/bid.controller'
import { updateAskData } from 'app/model/ask.controller'
import { SenLpState } from 'app/constant/senLpState'
import configs from 'app/configs'

const {
  sol: { node, cluster },
} = configs
const connection = new Connection(node)

const View = () => {
  const { pools } = usePool()
  const {
    wallet: { address: walletAddress },
  } = useWallet()
  const dispatch = useDispatch<AppDispatch>()
  const { state } = useLocation<SenLpState>()
  const [bid, setBid] = useState('')
  const [ask, setAsk] = useState('')
  const bidData = useMintSelection(bid)
  const askData = useMintSelection(ask)
  const poolAddress = state?.poolAddress
  const { enhancement } = useSelector((state: AppState) => state.settings)

  /** Check state when user come from sen LP */
  const checkIsSenLpCome = useCallback(() => {
    if (!account.isAddress(poolAddress)) return
    const poolData = pools[poolAddress]
    if (!poolData) return
    setBid(poolData?.mint_a)
    setAsk(poolData?.mint_b)
  }, [poolAddress, pools])

  useEffect(() => {
    checkIsSenLpCome()
  }, [checkIsSenLpCome])

  useEffect(() => {
    if (
      !account.isAddress(bidData.accountAddress) ||
      !account.isAddress(askData.accountAddress)
    )
      return
    dispatch(updateBidData(bidData))
    dispatch(updateAskData(askData))
  }, [askData, bidData, dispatch])

  return (
    <JupiterProvider
      connection={connection}
      cluster={cluster}
      userPublicKey={new PublicKey(walletAddress)}
    >
      <Row
        gutter={[24, 24]}
        style={{ paddingBottom: 12 }}
        justify={enhancement ? 'start' : 'center'}
      >
        <Col lg={8} md={12} xs={24}>
          <Swap />
        </Col>
        {enhancement && (
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
        )}
      </Row>
    </JupiterProvider>
  )
}

export default View
