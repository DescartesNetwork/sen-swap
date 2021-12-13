import {
  Fragment,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { TokenInfo } from '@solana/spl-token-registry'
import { useSelector } from 'react-redux'
import { PoolData } from '@senswap/sen-js'

import { Col, Row, Typography } from 'antd'
import RouteAvatar from './routeAvatar'
import InversePrice from './inversePirce'
import SwitchPriceRate from './switchPriceRate'

import { AppState } from 'app/model'
import { numeric } from 'shared/util'
import { useSlippageRate } from '../hooks/useSlippageRate'

export type HopData = {
  poolData: PoolData & { address: string }
  srcMintInfo: TokenInfo
  dstMintInfo: TokenInfo
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
  const [inReverse, setInReverse] = useState(false)
  const { slippage: slippageSettings } = useSelector(
    (state: AppState) => state.settings,
  )
  const { route } = useSelector((state: AppState) => state.route)
  const bidData = useSelector((state: AppState) => state.bid)
  const askData = useSelector((state: AppState) => state.ask)
  const slippageRate = useSlippageRate()

  const { mintInfo: bidMintInfo } = bidData

  const routeIcons = useMemo(() => {
    if (!route?.hops) return
    const { logoURI } = bidMintInfo || {}
    let listRouteIcons = [logoURI]
    for (const hop of route?.hops) {
      const {
        dstMintInfo: { logoURI },
      } = hop
      if (logoURI) listRouteIcons.push(logoURI)
    }
    return listRouteIcons
  }, [bidMintInfo, route?.hops])

  const calculatePrice = useCallback(() => {
    if (!bidData.amount || !askData.amount) return <Fragment />
    if (inReverse) return <InversePrice bidData={askData} askData={bidData} />
    return <InversePrice bidData={bidData} askData={askData} />
  }, [askData, bidData, inReverse])

  useEffect(() => {
    calculatePrice()
  }, [calculatePrice])

  return (
    <Row gutter={[12, 12]}>
      <Col span={24}>
        <ExtraTypography
          label="Price impact"
          content={
            <Typography.Text type="danger">
              {numeric(Number(slippageRate)).format('0.[0000]%')}
            </Typography.Text>
          }
        />
      </Col>
      <Col span={24}>
        <ExtraTypography
          label="Price"
          content={
            <SwitchPriceRate
              priceRate={calculatePrice()}
              value={inReverse}
              onChange={setInReverse}
            />
          }
        />
      </Col>
      <Col span={24}>
        <ExtraTypography
          label="Slippage Tolerance"
          content={numeric(slippageSettings).format('0.[00]%')}
        />
      </Col>
      <Col span={24}>
        <ExtraTypography label="Protocol Fee" content="0.25%" />
      </Col>
      <Col span={24}>
        <ExtraTypography
          label="Route"
          content={<RouteAvatar icons={routeIcons} />}
        />
      </Col>
    </Row>
  )
}

export default PreviewSwap
