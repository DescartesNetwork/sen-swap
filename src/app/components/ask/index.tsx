import { useMemo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { account } from '@senswap/sen-js'

import { Row, Col, Typography } from 'antd'
import { SelectionInfo } from '../selection/mintSelection'
import Selection from '../selection'
import NumericInput from 'shared/antd/numericInput'

import configs from 'app/configs'
import { useWallet } from 'senhub/providers'
import { numeric } from 'shared/util'
import { AppDispatch, AppState } from 'app/model'
import { updateAskData } from 'app/model/ask.controller'
import { useMintAccount } from 'app/hooks/useMintAccount'
import { useMintSelection } from 'app/hooks/useMintSelection'
import { SenLpState } from 'app/constant/senLpState'

const Ask = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { wallet } = useWallet()
  const askData = useSelector((state: AppState) => state.ask)
  const { state } = useLocation<SenLpState>()
  const { balance } = useMintAccount(askData.accountAddress)
  const selectionDefault = useMintSelection(configs.swap.askDefault)
  const poolAdress = state?.poolAddress

  // Select default
  useEffect(() => {
    if (
      account.isAddress(askData.accountAddress) ||
      account.isAddress(poolAdress)
    )
      return
    dispatch(updateAskData(selectionDefault))
  }, [askData.accountAddress, dispatch, poolAdress, selectionDefault])

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
    <Row gutter={[8, 8]}>
      <Col span={24}>
        <Typography.Text>To</Typography.Text>
      </Col>
      <Col span={24}>
        <NumericInput
          placeholder="0"
          value={askData.amount}
          onValue={onAmount}
          size="large"
          prefix={
            <Selection value={selectionInfo} onChange={onSelectionInfo} />
          }
        />
      </Col>
      <Col flex="auto" />
      <Col className="caption">
        <Typography.Text type="secondary">
          Available: {numeric(balance || 0).format('0,0.[00]')}{' '}
          {selectionInfo.mintInfo?.symbol || 'TOKEN'}
        </Typography.Text>
      </Col>
    </Row>
  )
}

export default Ask
