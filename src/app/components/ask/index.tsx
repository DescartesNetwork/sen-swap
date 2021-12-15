import { useMemo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { account } from '@senswap/sen-js'

import { Row, Col, Typography } from 'antd'
import { SelectionInfo } from '../selection/mintSelection'
import Selection from '../selection'

import { useWallet } from 'senhub/providers'
import { numeric } from 'shared/util'
import { AppDispatch, AppState } from 'app/model'
import { updateAskData } from 'app/model/ask.controller'
import NumericInput from 'app/shared/components/numericInput'
import { useMintAccount } from 'app/shared/hooks/useMintAccount'
import configs from 'app/configs'
import { useMintSelection } from '../hooks/useMintSelection'

const Ask = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { wallet } = useWallet()
  const askData = useSelector((state: AppState) => state.ask)

  const { balance } = useMintAccount(askData.accountAddress)
  const selectionDefault = useMintSelection(configs.swap.askDefault)

  // Select default
  useEffect(() => {
    if (askData.accountAddress) return
    dispatch(updateAskData(selectionDefault))
  }, [askData.accountAddress, dispatch, selectionDefault])

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

  return (
    <Row gutter={[8, 8]} justify="end">
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
      <Col span={24} style={{ textAlign: 'right', fontSize: 12 }}>
        <Typography.Text type="secondary">
          Available: {numeric(balance || 0).format('0,0.[00]')}{' '}
          {selectionInfo.mintInfo?.symbol || 'TOKEN'}
        </Typography.Text>
      </Col>
    </Row>
  )
}

export default Ask
