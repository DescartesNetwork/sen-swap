import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { account } from '@senswap/sen-js'
import { usePool, useWallet, rpc } from '@sentre/senhub'
import { JupiterProvider } from '@jup-ag/react-hook'
import { Connection, PublicKey } from '@solana/web3.js'

import { Row, Col } from 'antd'
import SwapChart from './chart'
import Swap from './swap'
import History from './history'

import { useMintSelection } from 'hooks/useMintSelection'
import { AppDispatch, AppState } from 'model'
import { updateBidData } from 'model/bid.controller'
import { updateAskData } from 'model/ask.controller'
import { SenLpState } from 'constant/senLpState'
import configs from 'configs'

const {
  sol: { cluster },
} = configs

const connection = new Connection(rpc)

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
