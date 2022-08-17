import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import { account } from '@senswap/sen-js'
import { rpc, useWalletAddress } from '@sentre/senhub'
import { JupiterProvider } from '@jup-ag/react-hook'
import { Connection, PublicKey } from '@solana/web3.js'

import { Row, Col, Segmented } from 'antd'
import SwapChart from './chart'
import Swap from './swap'
import PoolWatcher from 'watcher/poolWatcher'
import History from './history'

import { usePool } from 'hooks/usePool'
import { useMintSelection } from 'hooks/useMintSelection'
import { AppDispatch, AppState } from 'model'
import { updateBidData } from 'model/bid.controller'
import { updateAskData } from 'model/ask.controller'
import { SenLpState } from 'constant/senLpState'
import { HOMEPAGE_TABS } from 'constant/swap'
import configs from 'configs'

const {
  sol: { cluster },
} = configs

const connection = new Connection(rpc)

const View = () => {
  const { pools } = usePool()
  const walletAddress = useWalletAddress()
  const dispatch = useDispatch<AppDispatch>()
  const { state } = useLocation<SenLpState>()
  const [bid, setBid] = useState('')
  const [ask, setAsk] = useState('')
  const [tabId, setTabId] = useState(HOMEPAGE_TABS.swap)
  const bidData = useMintSelection(bid)
  const askData = useMintSelection(ask)
  const poolAddress = state?.poolAddress
  const { enhancement } = useSelector((state: AppState) => state.settings)
  const history = useHistory()

  /** Check state when user come from sen LP */
  const checkIsSenLpCome = useCallback(() => {
    if (!account.isAddress(poolAddress)) return
    const poolData = pools[poolAddress]
    if (!poolData) return
    setBid(poolData?.mint_a)
    setAsk(poolData?.mint_b)
  }, [poolAddress, pools])

  const onChangeSegmented = useCallback(
    (tabId: string) => {
      setTabId(tabId)
      history.push(`/app/sen_lp?autoInstall=true`)
    },
    [history],
  )

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
          <Row gutter={[24, 24]} justify="center">
            <Col>
              <Segmented
                className="swap-and-pool"
                options={Object.keys(HOMEPAGE_TABS).map((key) => {
                  return { label: key, value: HOMEPAGE_TABS[key] }
                })}
                value={tabId}
                onChange={(val) => onChangeSegmented(val.toString())}
                block
              />
            </Col>
            <Col span={24}>
              <Swap />
            </Col>
          </Row>
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
      <PoolWatcher />
    </JupiterProvider>
  )
}

export default View
