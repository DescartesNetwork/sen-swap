import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { PoolData, utils } from '@senswap/sen-js'

import { Card, Col, Divider, Row } from 'antd'
import MintPoolInfo from './mintPoolInfo'

import { AppState } from 'model'
import { extractReserve } from 'helper/router'
import useMintCgk from 'hooks/useMintCgk'
import './index.less'
import { util } from '@sentre/senhub/dist'

const PoolInfo = () => {
  const {
    route: { best },
    bid: { mintInfo: bidMintInfo },
    ask: { mintInfo: askMintInfo },
  } = useSelector((state: AppState) => state)
  const bidCgk = useMintCgk(bidMintInfo.address)
  const askCgk = useMintCgk(askMintInfo.address)

  const { poolData: bidPoolData } = best[0] || {}
  const { poolData: askPoolData } = best[best.length - 1] || {}

  const getMintTVL = (mintAddress?: string, poolData?: PoolData) => {
    try {
      if (!util.isAddress(mintAddress) || !poolData) return BigInt(0)
      return extractReserve(mintAddress, poolData)
    } catch (er) {
      return BigInt(0)
    }
  }

  // Bid TVL
  const bidTVL = useMemo(() => {
    if (!bidMintInfo.decimals) return 0
    const bid = getMintTVL(bidMintInfo.address, bidPoolData)
    return Number(utils.undecimalize(bid, bidMintInfo.decimals))
  }, [bidMintInfo, bidPoolData])
  // Ask TVL
  const askTVL = useMemo(() => {
    if (!askMintInfo.decimals) return 0
    const ask = getMintTVL(askMintInfo.address, askPoolData)
    return Number(utils.undecimalize(ask, askMintInfo.decimals))
  }, [askMintInfo, askPoolData])

  const disabled = !bidTVL || !askTVL

  return (
    <Card
      bordered={false}
      className={disabled ? 'disabled-swap-pool-info-card' : undefined}
    >
      <Row gutter={[16, 16]} wrap={false}>
        <Col span={11}>
          <MintPoolInfo
            mintAddress={bidMintInfo?.address || ''}
            tvl={bidTVL}
            price={bidTVL * bidCgk.price}
          />
        </Col>
        <Col>
          <Divider type="vertical" style={{ height: '100%' }} />
        </Col>
        <Col span={11}>
          <MintPoolInfo
            mintAddress={askMintInfo?.address || ''}
            tvl={askTVL}
            price={askTVL * askCgk.price}
          />
        </Col>
      </Row>
    </Card>
  )
}

export default PoolInfo
