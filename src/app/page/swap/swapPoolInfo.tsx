import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { account, PoolData, utils } from '@senswap/sen-js'

import { Card, Col, Divider, Row, Space, Typography } from 'antd'
import { MintAvatar } from 'app/shared/components/mint'

import { AppState } from 'app/model'
import { extractReserve } from 'app/helper/router'
import { numeric } from 'shared/util'
import useMintCgk from 'app/shared/hooks/useMintCgk'

const MintPoolInfo = ({
  mintAddress = '',
  tvl = '',
  symbol = '',
  price,
  format = '0,0.[00]a',
}: {
  mintAddress?: string
  tvl?: string | number
  symbol?: string
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
        <Typography.Title level={5}>{symbol}</Typography.Title>
      </Space>
      <Typography.Text className="caption" type="secondary">
        ~ ${numeric(price).format(format)}
      </Typography.Text>
    </Space>
  )
}

const SwapPoolInfo = () => {
  const { route } = useSelector((state: AppState) => state.route)
  const askMint = useSelector((state: AppState) => state.ask.mintInfo)
  const bidMint = useSelector((state: AppState) => state.bid.mintInfo)
  const askCgk = useMintCgk(askMint?.address)
  const bidCgk = useMintCgk(bidMint?.address)

  const { dstMintInfo: askMintInfo, poolData: askPoolData } =
    route?.hops[route?.hops.length - 1] || {}
  const { srcMintInfo: bidMintInfo, poolData: bidPoolData } =
    route?.hops[0] || {}

  const getMintTVL = (mintAddr?: string, poolData?: PoolData) => {
    if (!account.isAddress(mintAddr) || !poolData) return BigInt(0)
    return extractReserve(mintAddr, poolData)
  }

  const askTVL = useMemo(() => {
    if (!askMintInfo?.decimals) return 0
    const ask = getMintTVL(askMintInfo?.address, askPoolData)
    return Number(utils.undecimalize(ask, askMintInfo.decimals))
  }, [askMintInfo?.address, askMintInfo?.decimals, askPoolData])
  const bidTVL = useMemo(() => {
    if (!bidMintInfo?.decimals) return 0
    const bid = getMintTVL(bidMintInfo?.address, bidPoolData)
    return Number(utils.undecimalize(bid, bidMintInfo.decimals))
  }, [bidMintInfo?.address, bidMintInfo?.decimals, bidPoolData])

  return (
    <Card bordered={false}>
      <Row gutter={[16, 16]} wrap={false}>
        <Col span={11}>
          <MintPoolInfo
            mintAddress={bidMint?.address}
            tvl={bidTVL}
            symbol={bidMint?.symbol}
            price={bidTVL * bidCgk.price}
          />
        </Col>
        <Col>
          <Divider type="vertical" style={{ height: '100%' }} />
        </Col>
        <Col span={11}>
          <MintPoolInfo
            mintAddress={askMint?.address}
            tvl={askTVL}
            symbol={askMint?.symbol}
            price={askTVL * askCgk.price}
          />
        </Col>
      </Row>
    </Card>
  )
}

export default SwapPoolInfo
