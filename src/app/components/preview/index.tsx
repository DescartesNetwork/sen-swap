import { ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { PoolData } from '@senswap/sen-js'

import { Col, Row, Skeleton, Typography } from 'antd'
import RouteAvatar from './routeAvatar'

import { AppState } from 'app/model'
import { numeric } from 'shared/util'
import Price from './price'
import { priceImpactColor } from 'app/helper/utils'
import { useSwapStatus } from 'app/hooks/useSwapStatus'

export type LiteMintInfo = {
  address: string
  decimals: number
}

export type HopData = {
  poolData: PoolData & { address: string }
  srcMintAddress: string
  dstMintAddress: string
}

const ExtraTypography = ({
  label = '',
  content = '',
  loading = false,
}: {
  label?: string
  content?: string | ReactNode
  loading?: boolean
}) => {
  return (
    <Row align="middle">
      <Col flex="auto">
        <Typography.Text type="secondary">{label}</Typography.Text>
      </Col>
      <Col>
        {loading ? (
          <Skeleton.Input style={{ width: 150 }} active size="small" />
        ) : (
          <span>{content}</span>
        )}
      </Col>
    </Row>
  )
}

const PreviewSwap = () => {
  const {
    route: { priceImpact },
    settings: { slippage },
  } = useSelector((state: AppState) => state)
  const { loading } = useSwapStatus()

  return (
    <Row gutter={[12, 12]}>
      <Col span={24}>
        <ExtraTypography
          label="Price impact"
          content={
            <Typography.Text style={{ color: priceImpactColor(priceImpact) }}>
              {numeric(Number(priceImpact)).format('0.[0000]%')}
            </Typography.Text>
          }
          loading={loading}
        />
      </Col>
      <Col span={24}>
        <ExtraTypography label="Price" content={<Price />} loading={loading} />
      </Col>
      <Col span={24}>
        <ExtraTypography
          label="Slippage Tolerance"
          content={numeric(slippage).format('0.[00]%')}
          loading={loading}
        />
      </Col>
      <Col span={24} style={{ minHeight: 24 }}>
        <ExtraTypography
          label="Route"
          content={<RouteAvatar />}
          loading={loading}
        />
      </Col>
    </Row>
  )
}

export default PreviewSwap
