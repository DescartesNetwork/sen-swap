import { useMemo, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { account, utils } from '@senswap/sen-js'

import { Row, Col, Typography, Card, Space, Tooltip } from 'antd'
import { SelectionInfo } from '../selection/mintSelection'

import { AppDispatch, AppState } from 'app/model'
import { useAccount, useWallet } from 'senhub/providers'
import { updateAskData } from 'app/model/ask.controller'
import IonIcon from 'shared/ionicon'
import { numeric } from 'shared/util'
import cgk, { MintInfo } from 'app/helper/cgk'
import NumericInput from 'app/shared/components/numericInput'
import Selection from '../selection'

const Ask = () => {
  const dispatch = useDispatch<AppDispatch>()
  const askData = useSelector((state: AppState) => state.ask)
  const settings = useSelector((state: AppState) => state.settings)
  const [mapMintInfos, setMapMintInfos] = useState<Map<string, MintInfo>>()
  const { accounts } = useAccount()
  const {
    wallet: { address: walletAddress },
  } = useWallet()

  // Compute selection info
  const selectionInfo: SelectionInfo = useMemo(
    () => ({
      mintInfo: askData.mintInfo,
      poolAddress: askData.poolAddress,
      poolAddresses: askData.poolAddresses,
    }),
    [askData],
  )
  // Compute human-readable balance
  const balance = useMemo((): string => {
    if (!account.isAddress(askData.accountAddress)) return '0'
    const { amount } = accounts[askData.accountAddress] || {}
    const { decimals } = askData.mintInfo || {}
    if (!amount || !decimals) return '0'
    return utils.undecimalize(amount, decimals)
  }, [accounts, askData])
  // Handle amount
  const onAmount = (val: string) => {
    return dispatch(updateAskData({ amount: val, prioritized: true }))
  }
  // Update ask data
  const onSelectionInfo = async (selectionInfo: SelectionInfo) => {
    const { splt } = window.sentre
    const { address: mintAddress } = selectionInfo.mintInfo || {}
    if (!account.isAddress(mintAddress))
      return dispatch(updateAskData({ ...selectionInfo }))
    const accountAddress = await splt.deriveAssociatedAddress(
      walletAddress,
      mintAddress,
    )
    dispatch(updateAskData({ accountAddress, ...selectionInfo }))
  }

  const priceCGK = useMemo(() => {
    const { mintInfo } = selectionInfo
    const { amount } = askData
    if (!mapMintInfos || !mintInfo || !amount) return
    const { address } = mintInfo
    let priceInfo
    if (mapMintInfos.has(address)) priceInfo = mapMintInfos.get(address)
    const { price: priceCGK } = priceInfo || {}
    const price = Number(amount) * (priceCGK || 0)
    return price
  }, [askData, mapMintInfos, selectionInfo])

  useEffect(() => {
    if (!settings.advanced) dispatch(updateAskData({ poolAddress: undefined }))
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
      <Col span={24}>
        <Typography.Text>To</Typography.Text>
      </Col>
      <Col span={24}>
        <Card
          bordered={false}
          className="card-child card-input"
          bodyStyle={{ padding: 4 }}
        >
          <NumericInput
            placeholder="0"
            value={askData.amount}
            onChange={onAmount}
            prefix={
              <Selection value={selectionInfo} onChange={onSelectionInfo} />
            }
            bordered={false}
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
                    {numeric(askData.amount).format('0,0.[0000]a')}{' '}
                    {selectionInfo.mintInfo?.symbol || 'TOKEN'} ~ $
                    {numeric(priceCGK).format('0,0.[0]a')}
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

export default Ask
