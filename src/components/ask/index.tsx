import { useMemo, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { account } from '@senswap/sen-js'
import { useMint, usePool, useUI, useWallet } from '@sentre/senhub'

import { Row, Col, Typography, Space } from 'antd'
import { SelectionInfo } from '../selection/mintSelection'
import NumericInput from 'shared/antd/numericInput'
import { MintSelection, MintSymbol } from 'shared/antd/mint'

import configs from 'configs'
import { util } from '@sentre/senhub'
import { AppDispatch, AppState } from 'model'
import { updateAskData } from 'model/ask.controller'
import { useMintSelection } from 'hooks/useMintSelection'
import { SenLpState } from 'constant/senLpState'
import useAccountBalance from 'shared/hooks/useAccountBalance'
import { setLoadingSenSwap } from 'model/route.controller'

const Ask = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    wallet: { address: walletAddress },
  } = useWallet()
  const { pools } = usePool()
  const { getDecimals } = useMint()
  const {
    ui: { theme },
  } = useUI()
  const {
    ask: { amount, accountAddress, mintInfo, poolAddresses },
  } = useSelector((state: AppState) => state)
  const { state } = useLocation<SenLpState>()
  const { balance: maxBalance } = useAccountBalance(accountAddress)
  const selectionDefault = useMintSelection(configs.swap.askDefault)
  const poolAddress = state?.poolAddress

  // Select default
  useEffect(() => {
    if (account.isAddress(accountAddress) || account.isAddress(poolAddress))
      return
    dispatch(setLoadingSenSwap({ loadingSenswap: true }))
    dispatch(updateAskData(selectionDefault))
  }, [accountAddress, dispatch, poolAddress, selectionDefault])

  // Compute selection info
  const selectionInfo: SelectionInfo = useMemo(
    () => ({ mintInfo, poolAddresses }),
    [mintInfo, poolAddresses],
  )

  // Handle amount
  const onAmount = (val: string) => {
    dispatch(setLoadingSenSwap({ loadingSenswap: true }))
    dispatch(updateAskData({ amount: val, prioritized: true }))
  }

  // Compute available pools
  const getAvailablePoolAddresses = useCallback(
    (mintAddress: string) => {
      if (!account.isAddress(mintAddress)) return []
      return Object.keys(pools).filter((poolAddress) => {
        const { mint_a, mint_b } = pools[poolAddress]
        return [mint_a, mint_b].includes(mintAddress)
      })
    },
    [pools],
  )

  const onSelectionInfo = async (mintAddress: string) => {
    const { splt } = window.sentre
    const poolAddresses = getAvailablePoolAddresses(mintAddress)
    const decimals = await getDecimals(mintAddress)

    const selectionInfo: SelectionInfo = {
      mintInfo: {
        address: mintAddress,
        decimals,
      },
      poolAddresses,
    }

    dispatch(setLoadingSenSwap({ loadingSenswap: true }))
    if (!account.isAddress(mintAddress))
      return dispatch(
        updateAskData({ amount: '', prioritized: true, ...selectionInfo }),
      )
    const accountAddress = await splt.deriveAssociatedAddress(
      walletAddress,
      mintAddress,
    )

    return dispatch(
      updateAskData({
        amount: '',
        prioritized: true,
        accountAddress,
        ...selectionInfo,
      }),
    )
  }

  const DARK_BOX_SHADOW = '0px 4px 44px rgba(0, 0, 0, 0.42)'
  const LIGHT_BOX_SHADOW = '0px 4px 40px rgba(33, 36, 51, 0.18)'

  const MINT_SELECTION_STYLE = {
    marginLeft: -7,
    padding: '3px 8px',
    borderRadius: 8,
    cursor: 'pointer',
    boxShadow: theme === 'dark' ? DARK_BOX_SHADOW : LIGHT_BOX_SHADOW,
  }

  return (
    <Row gutter={[0, 0]}>
      <Col flex="auto">
        <MintSelection
          value={mintInfo.address}
          onChange={onSelectionInfo}
          style={MINT_SELECTION_STYLE}
        />
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
            {util.numeric(maxBalance).format('0,0.[00]')}
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
