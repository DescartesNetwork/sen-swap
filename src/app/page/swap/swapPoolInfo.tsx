import { useSelector } from 'react-redux'

import { Card, Col, Divider, Row, Space, Typography } from 'antd'
import { MintAvatar } from 'app/shared/components/mint'
import { AppState } from 'app/model'
import { useMemo } from 'react'
import { extractReserve } from 'app/helper/router'
import { utils } from '@senswap/sen-js'
import { numeric } from 'shared/util'
import useMintCgk from 'app/shared/hooks/useMintCgk'

const SwapPoolInfo = () => {
  const { route } = useSelector((state: AppState) => state.route)
  const askMint = useSelector((state: AppState) => state.ask.mintInfo)
  const bidMint = useSelector((state: AppState) => state.bid.mintInfo)

  const askCgk = useMintCgk(askMint?.address)
  const bidCgk = useMintCgk(bidMint?.address)
  const askHop = route?.hops.at(-1)

  const askPoolData = useMemo(() => {
    return askHop?.poolData
  }, [askHop?.poolData])

  const askMintPoolTVL = useMemo(() => {
    if (!askMint?.address || !askPoolData) return BigInt(0)
    return extractReserve(askMint.address, askPoolData)
  }, [askMint?.address, askPoolData])

  const bidPoolData = useMemo(() => {
    return route?.hops[0]?.poolData
  }, [route?.hops])

  const bidTVL = useMemo(() => {
    if (!bidMint?.address || !bidPoolData) return BigInt(0)
    return extractReserve(bidMint.address, bidPoolData)
  }, [bidMint?.address, bidPoolData])

  return (
    <Card bordered={false}>
      <Row gutter={[16, 16]}>
        <Col span={11}>
          <Space direction="vertical" size={4}>
            <MintAvatar mintAddress={bidMint?.address || ''} />
            <Space>
              <Typography.Text>TVL:</Typography.Text>
              <Typography.Title level={5}>
                {numeric(
                  utils.undecimalize(bidTVL, bidMint?.decimals || 9),
                ).format('0,0.[00]a')}
              </Typography.Title>
              <Typography.Title level={5}>{bidMint?.symbol}</Typography.Title>
            </Space>
            <Typography.Text className="caption" type="secondary">
              ~ $
              {numeric(
                Number(utils.undecimalize(bidTVL, bidMint?.decimals || 9)) *
                  bidCgk.price,
              ).format('0,0.[00]a')}
            </Typography.Text>
          </Space>
        </Col>
        <Col>
          <Divider type="vertical" style={{ height: '100%' }} />
        </Col>
        <Col span={11}>
          <Space direction="vertical" size={4}>
            <MintAvatar mintAddress={askHop?.dstMintInfo.address || ''} />
            <Space>
              <Typography.Text>TVL:</Typography.Text>
              <Typography.Title level={5}>
                {numeric(
                  utils.undecimalize(
                    askMintPoolTVL,
                    askHop?.dstMintInfo.decimals || 9,
                  ),
                ).format('0,0.[00]a')}
              </Typography.Title>
              <Typography.Title level={5}>
                {askHop?.dstMintInfo.symbol}
              </Typography.Title>
            </Space>
            <Typography.Text className="caption" type="secondary">
              ~ $
              {numeric(
                Number(
                  utils.undecimalize(
                    askMintPoolTVL,
                    askHop?.dstMintInfo.decimals || 9,
                  ),
                ) * askCgk.price,
              ).format('0,0.[00]a')}
            </Typography.Text>
          </Space>
        </Col>
      </Row>
    </Card>
  )
}

export default SwapPoolInfo
