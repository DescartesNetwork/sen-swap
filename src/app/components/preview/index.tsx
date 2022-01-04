import { ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { PoolData } from '@senswap/sen-js'

import { Col, Row, Typography } from 'antd'
import RouteAvatar from './routeAvatar'

import { AppState } from 'app/model'
import { numeric } from 'shared/util'
import usePriceImpact from 'app/hooks/usePriceImpact'
import Price from './price'

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
}: {
  label?: string
  content?: string | ReactNode
}) => {
  return (
    <Row>
      <Col flex="auto">
        <Typography.Text type="secondary">{label}</Typography.Text>
      </Col>
      <Col>
        <span>{content}</span>
      </Col>
    </Row>
  )
}

const PreviewSwap = () => {
  const {
    settings: { slippage },
  } = useSelector((state: AppState) => state)
  const priceImpact = usePriceImpact()

  return (
    <Row gutter={[12, 12]}>
      <Col span={24}>
        <ExtraTypography
          label="Price impact"
          content={
            <Typography.Text type="danger">
              {numeric(Number(priceImpact)).format('0.[0000]%')}
            </Typography.Text>
          }
        />
      </Col>
      <Col span={24}>
        <ExtraTypography label="Price" content={<Price />} />
      </Col>
      <Col span={24}>
        <ExtraTypography
          label="Slippage Tolerance"
          content={numeric(slippage).format('0.[00]%')}
        />
      </Col>
      <Col span={24}>
        <ExtraTypography label="Route" content={<RouteAvatar />} />
      </Col>
    </Row>
  )
}

export default PreviewSwap
