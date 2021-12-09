import { useSelector } from 'react-redux'
import { TokenInfo } from '@solana/spl-token-registry'
import { PoolData, utils } from '@senswap/sen-js'

import { Row, Col, Card, Space, Avatar, Button, Typography } from 'antd'
import IonIcon from 'shared/ionicon'

import { AppState } from 'app/model'
import { numeric } from 'shared/util'
import { curve, slippage } from 'app/helper/oracle'

export type HopData = {
  poolData: PoolData & { address: string }
  srcMintInfo: TokenInfo
  dstMintInfo: TokenInfo
}

const Hop = ({ bidAmount, data }: { bidAmount: string; data: HopData }) => {
  const settings = useSelector((state: AppState) => state.settings)
  const {
    srcMintInfo: { logoURI: srcLogoURI, symbol: srcSymbol },
    dstMintInfo: { logoURI: dstLogoURI, symbol: dstSymbol },
  } = data

  const {
    poolData: { fee_ratio, tax_ratio },
  } = data
  const askAmount = curve(bidAmount, data)
  const slippageRate = utils.undecimalize(slippage(bidAmount, data), 9)

  return (
    <Card className="shadowed" bordered={false}>
      <Row gutter={[32, 16]}>
        <Col span={24}>
          <Space>
            <Avatar src={srcLogoURI} />
            <Typography.Title level={5} style={{ margin: 0 }}>
              {srcSymbol}
            </Typography.Title>
            <Button
              type="text"
              icon={<IonIcon name="arrow-forward-outline" />}
            />
            <Avatar src={dstLogoURI} />
            <Typography.Title level={5} style={{ margin: 0 }}>
              {dstSymbol}
            </Typography.Title>
          </Space>
        </Col>
        <Col>
          <Space direction="vertical" size={0}>
            <Typography.Text
              type="secondary"
              style={{ fontSize: 12, margin: 0 }}
            >
              Bid
            </Typography.Text>
            <Space>
              <Typography.Text>{bidAmount}</Typography.Text>
              <Typography.Text
                type="secondary"
                style={{ fontSize: 12, margin: 0 }}
              >
                {srcSymbol}
              </Typography.Text>
            </Space>
          </Space>
        </Col>
        <Col>
          <Space direction="vertical" size={0}>
            <Typography.Text
              type="secondary"
              style={{ fontSize: 12, margin: 0 }}
            >
              Ask
            </Typography.Text>
            <Space>
              <Typography.Text>{askAmount}</Typography.Text>
              <Typography.Text
                type="secondary"
                style={{ fontSize: 12, margin: 0 }}
              >
                {dstSymbol}
              </Typography.Text>
            </Space>
          </Space>
        </Col>
        <Col>
          <Space direction="vertical" size={0}>
            <Typography.Text
              type="secondary"
              style={{ fontSize: 12, margin: 0 }}
            >
              Limit ({settings.slippage * 100}%)
            </Typography.Text>
            <Space>
              <Typography.Text>
                {numeric(Number(askAmount) * (1 - settings.slippage)).format(
                  '0.[0000]',
                )}
              </Typography.Text>
              <Typography.Text
                type="secondary"
                style={{ fontSize: 12, margin: 0 }}
              >
                {dstSymbol}
              </Typography.Text>
            </Space>
          </Space>
        </Col>
        <Col>
          <Space direction="vertical" size={0}>
            <Typography.Text
              type="secondary"
              style={{ fontSize: 12, margin: 0 }}
            >
              Offering Price
            </Typography.Text>
            <Space>
              <Typography.Text>
                {numeric(Number(askAmount) / Number(bidAmount)).format(
                  '0.[0000]',
                )}
              </Typography.Text>
              <Typography.Text
                type="secondary"
                style={{ fontSize: 12, margin: 0 }}
              >
                {`${dstSymbol} / ${srcSymbol}`}
              </Typography.Text>
            </Space>
          </Space>
        </Col>
        <Col>
          <Space direction="vertical" size={0}>
            <Typography.Text
              type="secondary"
              style={{ fontSize: 12, margin: 0 }}
            >
              Price Impact
            </Typography.Text>
            <Space size={4}>
              <Typography.Text
                type="danger"
                style={{ fontSize: 12, margin: 0 }}
              >
                <IonIcon name="arrow-down-circle-outline" />{' '}
              </Typography.Text>
              <Typography.Text type="danger">
                {numeric(Number(slippageRate) * 100).format('0.[0000]')} %
              </Typography.Text>
            </Space>
          </Space>
        </Col>
        <Col>
          <Space direction="vertical" size={0}>
            <Typography.Text
              type="secondary"
              style={{ fontSize: 12, margin: 0 }}
            >
              Protocol Fee
            </Typography.Text>
            <Typography.Text>
              {utils.undecimalize(fee_ratio + tax_ratio, 7)}%
            </Typography.Text>
          </Space>
        </Col>
      </Row>
    </Card>
  )
}

export default Hop
