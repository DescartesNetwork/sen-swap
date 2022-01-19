import moment from 'moment'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { utils } from '@senswap/sen-js'

import SwapService from 'app/lib/stat/logic/swap/swap'

export type State = {
  historySwap: HistorySwap[]
}

/**
 * Store constructor
 */

export type HistorySwap = {
  time: string
  transactionId: string
  from?: string
  to?: string
  amountFrom?: number
  amountTo?: number
  key: string
  status: string
  decimals: number
}

const NAME = 'history'
const initialState: State = {
  historySwap: [],
}

/**
 * Actions
 */
export const fetchHistorySwap = createAsyncThunk<{
  historySwap: HistorySwap[]
}>(`${NAME}/fetchHistorySwap`, async () => {
  const myWalletAddress = await window.sentre.wallet?.getAddress()
  if (!myWalletAddress) throw Error('Login first')

  const transLogService = new SwapService(myWalletAddress)
  const transLogsData = await transLogService.fetchHistory()
  let history: HistorySwap[] = []

  for (const transLog of transLogsData) {
    const historyItem = {} as HistorySwap
    const actionTransfer = transLog.actionTransfers
    const firstAction = actionTransfer[0]
    const lastAction = actionTransfer[actionTransfer.length - 1]
    if (!firstAction || !lastAction) continue

    const time = new Date(transLog.blockTime * 1000)
    historyItem.time = moment(time).format('MMM DD, YYYY HH:mm')
    historyItem.amountFrom = firstAction.destination
      ? Number(
          utils.undecimalize(
            BigInt(firstAction.amount),
            firstAction.destination.decimals,
          ),
        )
      : undefined
    historyItem.amountTo = lastAction?.destination
      ? Number(
          utils.undecimalize(
            BigInt(lastAction.amount),
            lastAction.destination.decimals,
          ),
        )
      : undefined

    historyItem.from = firstAction.destination?.mint
    historyItem.to = lastAction?.destination?.mint
    historyItem.transactionId = transLog.signature
    historyItem.key = transLog.signature
    historyItem.status =
      !firstAction.destination || !lastAction?.destination
        ? 'failed'
        : 'success'
    history.push(historyItem)
  }
  return { historySwap: history }
})

/**
 * Usual procedure
 */

const slice = createSlice({
  name: NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    void builder.addCase(
      fetchHistorySwap.fulfilled,
      (state, { payload }) => void Object.assign(state, payload),
    ),
})

export default slice.reducer
