import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { account, DEFAULT_WSOL, utils } from '@senswap/sen-js'

import { Row, Col, Typography, Button, Space, Tooltip } from 'antd'
import IonIcon from 'shared/antd/ionicon'
import WormHoleSupported from '../wormHoleSupported'
import Selection from '../selection'

import { useMint, useWallet } from 'senhub/providers'
import { numeric } from 'shared/util'
import { AppDispatch, AppState } from 'app/model'
import { updateBidData } from 'app/model/bid.controller'
import NumericInput from 'app/shared/components/numericInput'
import { SelectionInfo } from '../selection/mintSelection'
import { useMintSelection } from '../hooks/useMintSelection'
import { useMintAccount } from 'app/shared/hooks/useMintAccount'
import useMintCgk from 'app/shared/hooks/useMintCgk'
import configs from 'app/configs'

const Bid = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    wallet: { address: walletAddress, lamports },
  } = useWallet()
  const bidData = useSelector((state: AppState) => state.bid)
  const { getMint } = useMint()
  const [wormholeSupported, setWormholeSupported] = useState(false)

  const { balance, decimals, mint, amount } = useMintAccount(
    bidData.accountAddress,
  )
  const cgkData = useMintCgk(bidData.mintInfo?.address)
  const selectionDefault = useMintSelection(configs.swap.bidDefault)

  // Select default
  useEffect(() => {
    dispatch(updateBidData(selectionDefault))
  }, [dispatch, selectionDefault])

  // Compute selection info
  const selectionInfo: SelectionInfo = useMemo(
    () => ({
      mintInfo: bidData.mintInfo,
      poolAddresses: bidData.poolAddresses,
    }),
    [bidData],
  )

  // Compute human-readable balance
  const balanceTransfer = useMemo((): string => {
    if (mint !== DEFAULT_WSOL) return balance
    // So estimate max = 0.01 fee -> multi transaction.
    const estimateFee = utils.decimalize(0.01, decimals)
    const max = lamports + amount - estimateFee
    if (max <= amount) return utils.undecimalize(amount, decimals)
    return utils.undecimalize(max, decimals)
  }, [amount, balance, decimals, lamports, mint])

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

  // calculator
  const totalValue = cgkData.price * Number(bidData.amount)

  useEffect(() => {
    ;(async () => {
      const bidMintAddr = selectionInfo?.mintInfo?.address
      if (!account.isAddress(bidMintAddr)) return
      const bidMintInfo = await getMint({ address: bidMintAddr })
      if (!bidMintInfo[bidMintAddr]) return
      const mintAuthorityAddr = bidMintInfo[bidMintAddr]?.mint_authority
      if (mintAuthorityAddr === configs.wormhole.wormholeAddress)
        return setWormholeSupported(true)
      return setWormholeSupported(false)
    })()
  }, [getMint, selectionInfo])

  return (
    <Row gutter={[8, 8]}>
      <Col flex="auto">
        <Typography.Text>From</Typography.Text>
      </Col>
      {wormholeSupported && (
        <Col>
          <WormHoleSupported />
        </Col>
      )}
      <Col span={24}>
        <NumericInput
          placeholder="0"
          value={bidData.amount}
          onChange={onAmount}
          size="large"
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
          max={balanceTransfer}
        />
      </Col>
      <Col span={24}>
        <Row gutter={[4, 4]} style={{ fontSize: 12, marginLeft: 2 }}>
          <Col flex="auto">
            {cgkData.price ? (
              <Tooltip title="The estimation is based on CoinGecko API.">
                <Space size={4}>
                  <IonIcon name="information-circle-outline" />
                  <Typography.Text type="secondary">
                    {numeric(bidData.amount).format('0,0.[0000]')}{' '}
                    {selectionInfo.mintInfo?.symbol || 'TOKEN'} ~ $
                    {numeric(totalValue).format('0,0.[00]a')}
                  </Typography.Text>
                </Space>
              </Tooltip>
            ) : null}
          </Col>
          <Col>
            <Typography.Text type="secondary">
              Available: {numeric(balanceTransfer || 0).format('0,0.[00]')}{' '}
              {selectionInfo.mintInfo?.symbol || 'TOKEN'}
            </Typography.Text>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default Bid
