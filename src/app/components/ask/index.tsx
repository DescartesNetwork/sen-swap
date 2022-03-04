import { useMemo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { account } from '@senswap/sen-js'
import { useWallet } from '@senhub/providers'

import { Row, Col, Typography, Space } from 'antd'
import { SelectionInfo } from '../selection/mintSelection'
import Selection from '../selection'
import NumericInput from 'shared/antd/numericInput'
import { MintSymbol } from 'shared/antd/mint'

import configs from 'app/configs'
import { numeric } from 'shared/util'
import { AppDispatch, AppState } from 'app/model'
import { updateAskData } from 'app/model/ask.controller'
import { useMintSelection } from 'app/hooks/useMintSelection'
import { SenLpState } from 'app/constant/senLpState'
import useAccountBalance from 'shared/hooks/useAccountBalance'

const Ask = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { wallet } = useWallet()
  const {
    ask: { amount, accountAddress, mintInfo, poolAddresses },
  } = useSelector((state: AppState) => state)
  const { state } = useLocation<SenLpState>()
  const { balance: maxBalance } = useAccountBalance(accountAddress)
  const selectionDefault = useMintSelection(configs.swap.askDefault)
  const poolAdress = state?.poolAddress

  // Select default
  useEffect(() => {
    if (account.isAddress(accountAddress) || account.isAddress(poolAdress))
      return
    dispatch(updateAskData(selectionDefault))
  }, [accountAddress, dispatch, poolAdress, selectionDefault])

  // Compute selection info
  const selectionInfo: SelectionInfo = useMemo(
    () => ({ mintInfo, poolAddresses }),
    [mintInfo, poolAddresses],
  )

  // Handle amount
  const onAmount = (val: string) =>
    dispatch(updateAskData({ amount: val, prioritized: true }))

  // Update ask data
  const onSelectionInfo = async (selectionInfo: SelectionInfo) => {
    const { splt } = window.sentre
    const { address: mintAddress } = selectionInfo.mintInfo || {}
    if (!account.isAddress(mintAddress))
      return dispatch(
        updateAskData({ amount: '', prioritized: true, ...selectionInfo }),
      )
    const accountAddress = await splt.deriveAssociatedAddress(
      wallet.address,
      mintAddress,
    )
    dispatch(
      updateAskData({
        amount: '',
        prioritized: true,
        accountAddress,
        ...selectionInfo,
      }),
    )
  }

  return (
    <Row gutter={[0, 0]}>
      <Col flex="auto">
        <Selection value={selectionInfo} onChange={onSelectionInfo} />
      </Col>
      <Col>
        <NumericInput
          bordered={false}
          style={{
            textAlign: 'right',
            fontSize: 24,
            maxWidth: 150,
            padding: 0,
          }}
          placeholder="0"
          value={amount}
          onValue={onAmount}
        />
      </Col>
      <Col span={24}>
        <Space className="caption">
          <Typography.Text type="secondary">Available:</Typography.Text>
          <Typography.Text type="secondary">
            {numeric(maxBalance).format('0,0.[00]')}
          </Typography.Text>
          <Typography.Text type="secondary">
            <MintSymbol mintAddress={selectionInfo.mintInfo?.address || ''} />
          </Typography.Text>
        </Space>
      </Col>
    </Row>
  )
}

export default Ask
