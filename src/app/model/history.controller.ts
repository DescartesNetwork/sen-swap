import moment from 'moment'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { utils } from '@senswap/sen-js'

import configs from 'os/configs'
import { TransLog } from 'app/lib/stat/entities/trans-log'
import SwapTranslogService from 'app/lib/stat/logic/translogSwap'

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

const LIMIT_HISTORY_SWAP = 20

const NAME = 'history'
const initialState: State = {
  historySwap: [],
}

const filterFunction = (transLog: TransLog) => {
  if (!transLog.actionTransfers.length) return false
  return transLog.actionType === 'SWAP'
}

/**
 * Actions
 */
export const fetchHistorySwap = createAsyncThunk<
  { historySwap: HistorySwap[] },
  { lastSignature?: string; isLoadMore?: boolean },
  { state: { history: State } }
>(
  `${NAME}/fetchHistorySwap`,
  async ({ lastSignature, isLoadMore }, { getState }) => {
    const {
      sol: { swapAddress },
    } = configs

    const {
      history: { historySwap },
    } = getState()

    const myWalletAddress = await window.sentre.wallet?.getAddress()
    if (!myWalletAddress) throw Error('Loggin first')

    const options = {
      limit: LIMIT_HISTORY_SWAP,
      lastSignature,
    }

    const transLogService = new SwapTranslogService()
    const transLogsData = await transLogService.collect(
      myWalletAddress,
      options,
      filterFunction,
    )
    let history: HistorySwap[] = []

    if (isLoadMore) history = [...historySwap]

    for (const transLog of transLogsData) {
      if (!transLog.actionType) continue
      const historyItem = {} as HistorySwap
      const actionTransfer = transLog.actionTransfers
      let lastAction

      const firstAction = actionTransfer[0]
      if (actionTransfer.length > 1)
        lastAction = actionTransfer[actionTransfer.length - 1]

      const programId = transLog.programId

      if (programId !== swapAddress) continue

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
  },
)

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
