import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { account, DEFAULT_WSOL, utils } from '@senswap/sen-js'

import { Row, Col, Typography, Button, Card, Space, Tooltip, Tag } from 'antd'

import { AppDispatch, AppState } from 'app/model'
import cgk, { MintInfo } from 'app/helper/cgk'
import { SelectionInfo } from '../selection/mintSelection'
import { useAccount, useWallet } from 'senhub/providers'
import { updateBidData } from 'app/model/bid.controller'
import Selection from '../selection'
import IonIcon from 'shared/ionicon'
import { numeric } from 'shared/util'
import NumericInput from 'app/shared/components/numericInput'
import { randomColor } from 'shared/helper'

const WORMHOLE_COLOR = '#F9575E'

const Bid = () => {
  const dispatch = useDispatch<AppDispatch>()
  const bidData = useSelector((state: AppState) => state.bid)
  const settings = useSelector((state: AppState) => state.settings)
  const [mapMintInfos, setMapMintInfos] = useState<Map<string, MintInfo>>()
  const { accounts } = useAccount()
  const {
    wallet: { lamports, address: walletAddress },
  } = useWallet()

  // Compute selection info
  const selectionInfo: SelectionInfo = useMemo(
    () => ({
      mintInfo: bidData.mintInfo,
      poolAddress: bidData.poolAddress,
      poolAddresses: bidData.poolAddresses,
    }),
    [bidData],
  )
  // Compute human-readable balance
  const balance = useMemo((): string => {
    if (!accounts) return '0'
    const bidAccount = accounts[bidData.accountAddress]
    const bidMint = bidData.mintInfo
    if (!bidMint || !bidAccount) return '0'
    const bidBalance = bidAccount?.amount || BigInt(0)
    if (bidMint.address !== DEFAULT_WSOL)
      return utils.undecimalize(bidBalance, bidMint.decimals)
    // So estimate max = 0.01 fee -> multi transaction.
    const estimateFee = utils.decimalize(0.01, bidMint.decimals)
    const max = lamports + bidBalance - estimateFee
    if (max <= bidBalance)
      return utils.undecimalize(bidBalance, bidMint.decimals)
    return utils.undecimalize(max, bidMint.decimals)
  }, [accounts, bidData, lamports])

  // Handle amount
  const onAmount = useCallback(
    (val: string) => {
      return dispatch(updateBidData({ amount: val, prioritized: true }))
    },
    [dispatch],
  )
  // All in :)))
  const onMax = () => onAmount(balance)
  // Update bid data
  const onSelectionInfo = async (selectionInfo: SelectionInfo) => {
    const { splt } = window.sentre
    const { address: mintAddress } = selectionInfo.mintInfo || {}
    if (!account.isAddress(mintAddress))
      return dispatch(updateBidData({ ...selectionInfo }))
    const accountAddress = await splt.deriveAssociatedAddress(
      walletAddress,
      mintAddress,
    )
    return dispatch(updateBidData({ accountAddress, ...selectionInfo }))
  }

  const priceCGK = useMemo(() => {
    const { mintInfo } = selectionInfo || {}
    const { amount } = bidData
    if (!mapMintInfos || !mintInfo || !amount) return
    const { address } = mintInfo
    let priceInfo
    if (mapMintInfos.has(address)) priceInfo = mapMintInfos.get(address)
    const { price: priceCGK } = priceInfo || {}
    const price = Number(amount) * (priceCGK || 0)
    return price
  }, [bidData, mapMintInfos, selectionInfo])

  useEffect(() => {
    if (!settings.advanced) dispatch(updateBidData({ poolAddress: undefined }))
  }, [settings, dispatch])

  useEffect(() => {
    const { mintInfo } = selectionInfo || {}
    if (!mintInfo) return
    ;(async () => {
      const infos = await cgk.getMintInfos([mintInfo.address])
      setMapMintInfos(infos)
    })()
  }, [selectionInfo])

  return (
    <Row gutter={[8, 8]}>
      <Col flex="auto">
        <Typography.Text>From</Typography.Text>
      </Col>
      <Col>
        <Space size={4}>
          <Typography.Text type="secondary">Supported</Typography.Text>
          <Tag
            style={{
              margin: 0,
              borderRadius: 4,
              color: randomColor(WORMHOLE_COLOR),
            }}
            color={randomColor(WORMHOLE_COLOR, 0.2)}
          >
            Wormhole Bridge
          </Tag>
        </Space>
      </Col>
      <Col span={24}>
        <Card
          bordered={false}
          className="card-child card-input"
          bodyStyle={{ padding: 4 }}
        >
          <NumericInput
            placeholder="0"
            value={bidData.amount}
            onChange={onAmount}
            prefix={
              <Selection value={selectionInfo} onChange={onSelectionInfo} />
            }
            suffix={
              <Button
                type="text"
                size="small"
                style={{ fontSize: 12, marginRight: -7 }}
                onClick={onMax}
              >
                MAX
              </Button>
            }
            bordered={false}
            max={balance}
          />
        </Card>
      </Col>
      <Col span={24}>
        <Row gutter={[4, 4]} style={{ fontSize: 12, marginLeft: 2 }}>
          <Col flex="auto">
            {priceCGK ? (
              <Tooltip title="The estimation is based on CoinGecko API.">
                <Space size={4}>
                  <IonIcon name="information-circle-outline" />
                  <Typography.Text type="secondary">
                    {numeric(bidData.amount).format('0,0.[0000]a')}{' '}
                    {selectionInfo.mintInfo?.symbol || 'TOKEN'} ~ $
                    {numeric(priceCGK).format('0,0.[00]a')}
                  </Typography.Text>
                </Space>
              </Tooltip>
            ) : null}
          </Col>
          <Col>
            <Typography.Text type="secondary">
              Available: {numeric(balance || 0).format('0,0.[00]')}{' '}
              {selectionInfo.mintInfo?.symbol || 'TOKEN'}
            </Typography.Text>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default Bid
