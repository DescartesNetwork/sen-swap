import { useMemo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { account } from '@senswap/sen-js'

import { Row, Col, Typography, Space, Tooltip } from 'antd'
import { SelectionInfo } from '../selection/mintSelection'
import Selection from '../selection'

import { useWallet } from 'senhub/providers'
import IonIcon from 'shared/antd/ionicon'
import { numeric } from 'shared/util'
import { AppDispatch, AppState } from 'app/model'
import { updateAskData } from 'app/model/ask.controller'
import NumericInput from 'app/shared/components/numericInput'
import useMintCgk from 'app/shared/hooks/useMintCgk'
import { useMintAccount } from 'app/shared/hooks/useMintAccount'
import configs from 'app/configs'
import { useMintSelection } from '../hooks/useMintSelection'

const Ask = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { wallet } = useWallet()
  const askData = useSelector((state: AppState) => state.ask)

  const { balance } = useMintAccount(askData.accountAddress)
  const cgkData = useMintCgk(askData.mintInfo?.address)
  const selectionDefault = useMintSelection(configs.swap.askDefault)

  // Select default
  useEffect(() => {
    dispatch(updateAskData(selectionDefault))
  }, [dispatch, selectionDefault])

  // Compute selection info
  const selectionInfo: SelectionInfo = useMemo(
    () => ({
      mintInfo: askData.mintInfo,
      poolAddresses: askData.poolAddresses,
    }),
    [askData],
  )

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
      wallet.address,
      mintAddress,
    )
    dispatch(updateAskData({ accountAddress, ...selectionInfo }))
  }

  // calculator
  const totalValue = cgkData.price * Number(askData.amount)

  return (
    <Row gutter={[8, 8]}>
      <Col span={24}>
        <Typography.Text>To</Typography.Text>
      </Col>
      <Col span={24}>
        <NumericInput
          placeholder="0"
          value={askData.amount}
          onChange={onAmount}
          size="large"
          prefix={
            <Selection value={selectionInfo} onChange={onSelectionInfo} />
          }
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
                    {numeric(askData.amount).format('0,0.[0000]')}{' '}
                    {selectionInfo.mintInfo?.symbol || 'TOKEN'} ~ $
                    {numeric(totalValue).format('0,0.[0]a')}
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
