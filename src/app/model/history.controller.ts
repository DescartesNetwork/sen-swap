import moment from 'moment'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { utils } from '@senswap/sen-js'
import { TransLogService } from 'app/lib/stat/logic/translog'
import configs from 'os/configs'

export type State = {
  historySwap: HistorySwap[]
}

/**
 * Store constructor
 */

export type HistorySwap = {
  time: string
  transactionId: string
  from: string
  to: string
  amountFrom: number
  amountTo: number
  key: string
}

const LIMIT_HISTORY_SWAP = 20

const NAME = 'history'
const initialState: State = {
  historySwap: [],
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

    const transLogService = new TransLogService()
    const transLogsData = await transLogService.collect(
      myWalletAddress,
      options,
    )
    let history: HistorySwap[] = []

    if (isLoadMore) history = [...historySwap]

    for (const transLog of transLogsData) {
      const historyItem = {} as HistorySwap
      const actionTransfer = transLog.actionTransfers
      const firstAction = actionTransfer[0]
      const lastAction = actionTransfer.at(-1)
      const programId = transLog.programId

      if (programId !== swapAddress) continue
      if (!firstAction.destination || !lastAction?.destination) continue

      const time = new Date(transLog.blockTime * 1000)

      historyItem.time = moment(time).format('DD MMM, YYYY hh:mm')
      historyItem.amountFrom = Number(
        utils.undecimalize(
          BigInt(firstAction.amount),
          firstAction.destination.decimals,
        ),
      )
      historyItem.amountTo = Number(
        utils.undecimalize(
          BigInt(lastAction.amount),
          lastAction.destination.decimals,
        ),
      )
      historyItem.from = firstAction.destination.mint
      historyItem.to = lastAction.destination.mint
      historyItem.transactionId = transLog.signature
      historyItem.key = transLog.signature
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
