import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { account, PoolData, utils } from '@senswap/sen-js'

import { Card, Col, Divider, Row, Space, Typography } from 'antd'
import { MintAvatar, MintSymbol } from 'shared/antd/mint'

import { AppState } from 'app/model'
import { extractReserve } from 'app/helper/router'
import { numeric } from 'shared/util'
import useMintCgk from 'app/hooks/useMintCgk'

const MintPoolInfo = ({
  mintAddress,
  tvl = '',
  price,
  format = '0,0.[00]a',
}: {
  mintAddress: string
  tvl?: string | number
  price?: number
  format?: string
}) => {
  return (
    <Space direction="vertical" size={4}>
      <MintAvatar mintAddress={mintAddress} />
      <Space>
        <Typography.Text>TVL:</Typography.Text>
        <Typography.Title level={5}>
          {numeric(tvl).format(format)}
        </Typography.Title>
        <Typography.Title level={5}>
          <MintSymbol mintAddress={mintAddress} />
        </Typography.Title>
      </Space>
      <Typography.Text className="caption" type="secondary">
        ~ ${numeric(price).format(format)}
      </Typography.Text>
    </Space>
  )
}

const SwapPoolInfo = () => {
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
      if (!account.isAddress(mintAddress) || !poolData) return BigInt(0)
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

  return (
    <Card bordered={false}>
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

export default SwapPoolInfo
