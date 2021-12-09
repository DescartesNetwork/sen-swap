import { useEffect, useMemo, Fragment } from 'react'
import { DEFAULT_WSOL, utils } from '@senswap/sen-js'
import { useSelector } from 'react-redux'

import { Row, Col, Typography, Card } from 'antd'
import Hop from './hop'
import WrapSol from './wrapSol'

import { BestRouteInfo } from 'app/helper/router'
import { useAccount } from 'senhub/providers'
import { AppState } from 'app/model'

const Preview = ({
  route,
  onChange = () => {},
  disabled = false,
}: {
  route?: BestRouteInfo
  onChange?: (wrappedSolAmount: bigint) => void
  disabled?: boolean
}) => {
  const bidData = useSelector((state: AppState) => state.bid)
  const { accounts } = useAccount()

  const wrapAmount = useMemo(() => {
    const bidMint = bidData.mintInfo
    const bidAccount = accounts[bidData.accountAddress]
    const bidBalance = bidAccount?.amount || BigInt(0)

    if (!bidMint || !Number(bidData.amount)) return BigInt(0)
    if (bidMint.address !== DEFAULT_WSOL) return BigInt(0)

    const bidAmount = utils.decimalize(bidData.amount, bidMint.decimals)
    if (bidAmount <= bidBalance) return BigInt(0)

    return bidAmount - bidBalance
  }, [accounts, bidData.accountAddress, bidData.amount, bidData.mintInfo])

  useEffect(() => {
    onChange(wrapAmount)
  }, [onChange, wrapAmount])

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Typography.Title style={{ margin: 0 }} level={5}>
          Review & Swap
        </Typography.Title>
      </Col>
      {!route?.hops.length || disabled ? (
        <Col span={24}>
          <Card className="shadowed" bordered={false}>
            <Typography.Text type="secondary">
              <span style={{ color: 'white' }}>🧙‍♀️</span> Input amount and tokens
              to review the swap!
            </Typography.Text>
          </Card>
        </Col>
      ) : (
        <Fragment>
          {wrapAmount && (
            <Col span={24}>
              <WrapSol amount={wrapAmount} />
            </Col>
          )}

          {route?.hops.map((hop, index) => (
            <Col span={24} key={index}>
              <Hop bidAmount={route.amounts[index]} data={hop} />
            </Col>
          ))}
        </Fragment>
      )}
    </Row>
  )
}

export default Preview
