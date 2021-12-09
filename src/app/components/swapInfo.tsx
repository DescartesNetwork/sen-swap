import { Fragment, ReactNode, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { DEFAULT_WSOL, utils } from '@senswap/sen-js'

import { Avatar, Col, Row, Space, Typography } from 'antd'

import { curve, slippage } from 'app/helper/oracle'
import { AppState } from 'app/model'
import { useAccount } from 'senhub/providers'
import { numeric } from 'shared/util'
import IonIcon from 'shared/antd/ionicon'

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
const RouteAvatar = ({
  icons = ['', ''],
  size = 24,
  defaultIcon = <IonIcon size={size} name="help-outline" />,
}: {
  icons?: (string | undefined)[]
  defaultIcon?: ReactNode
  size?: number
}) => {
  return (
    <Space>
      {icons?.map((icon, idx) => (
        <Fragment key={idx}>
          <Avatar src={icon} size={size}>
            {defaultIcon}
          </Avatar>
          {icons.length > idx + 1 && <IonIcon name="chevron-forward-outline" />}
        </Fragment>
      ))}
    </Space>
  )
}

const SwapInfo = () => {
  const { route } = useSelector((state: AppState) => state.route)
  const bidData = useSelector((state: AppState) => state.bid)
  const { accounts } = useAccount()
  const { mintInfo: bidMintInfo } = bidData

  const wrapAmount = useMemo(() => {
    const bidAccount = accounts[bidData.accountAddress]
    const bidBalance = bidAccount?.amount || BigInt(0)

    if (!bidMintInfo || !Number(bidData.amount)) return BigInt(0)
    if (bidMintInfo.address !== DEFAULT_WSOL) return BigInt(0)

    const bidAmount = utils.decimalize(bidData.amount, bidMintInfo.decimals)
    if (bidAmount <= bidBalance) return BigInt(0)

    return bidAmount - bidBalance
  }, [accounts, bidData.accountAddress, bidData.amount, bidMintInfo])
  const hopLastRoute = route?.hops.at(-1) // get lasted route hop
  const bidAmoutLastRoute = route?.amounts.at(-1) || '' // laseted route bid amount

  const askAmountLastRoute = useMemo(() => {
    if (!hopLastRoute) return 0
    return curve(bidAmoutLastRoute, hopLastRoute)
  }, [bidAmoutLastRoute, hopLastRoute])
  const slippageRate = useMemo(() => {
    if (!hopLastRoute) return 0
    return utils.undecimalize(slippage(bidAmoutLastRoute, hopLastRoute), 9)
  }, [bidAmoutLastRoute, hopLastRoute])

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

  console.log(route, wrapAmount, route?.hops.at(-1), 'route')

  return (
    <Row gutter={[12, 12]}>
      <Col span={24}>
        <ExtraTypography
          label="Price impart"
          content={`${numeric(Number(slippageRate) * 100).format('0.[0000]')}%`}
        />
      </Col>
      <Col span={24}>
        <ExtraTypography label="Price" content="0 SOL = 0 ETH" />
      </Col>
      <Col span={24}>
        <ExtraTypography label="Inverse price" content="0 SOL = 0 ETH" />
      </Col>
      <Col span={24}>
        <ExtraTypography label="Slippage toleance" content=" 0.5%" />
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

export default SwapInfo
