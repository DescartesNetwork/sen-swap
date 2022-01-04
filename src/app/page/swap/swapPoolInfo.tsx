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
  const { route } = useSelector((state: AppState) => state.route)
  const {
    bid: { mintInfo: bidMintInfo },
    ask: { mintInfo: askMintInfo },
  } = useSelector((state: AppState) => state)
  const bidCgk = useMintCgk(bidMintInfo?.address)
  const askCgk = useMintCgk(askMintInfo?.address)

  const { poolData: askPoolData } =
    route?.hops[route?.hops.length || 0 - 1] || {}
  const { poolData: bidPoolData } = route?.hops[0] || {}

  const getMintTVL = (mintAddr?: string, poolData?: PoolData) => {
    if (!account.isAddress(mintAddr) || !poolData) return BigInt(0)
    return extractReserve(mintAddr, poolData)
  }

  const askTVL = useMemo(() => {
    try {
      if (!askMintInfo?.decimals) return 0
      const ask = getMintTVL(askMintInfo?.address, askPoolData)
      return Number(utils.undecimalize(ask, askMintInfo.decimals))
    } catch (er) {
      return 0
    }
  }, [askMintInfo?.address, askMintInfo?.decimals, askPoolData])
  const bidTVL = useMemo(() => {
    try {
      if (!bidMintInfo?.decimals) return 0
      const bid = getMintTVL(bidMintInfo?.address, bidPoolData)
      return Number(utils.undecimalize(bid, bidMintInfo.decimals))
    } catch (er) {
      return 0
    }
  }, [bidMintInfo?.address, bidMintInfo?.decimals, bidPoolData])

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
