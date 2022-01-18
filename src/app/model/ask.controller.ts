import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { LiteMintInfo } from 'app/components/preview'

export type AskState = {
  amount: string // Desired amount
  accountAddress: string // Associated account to the selected token
  mintInfo: LiteMintInfo // Selected token
  poolAddresses: string[] // List of available pools
  priority: number
}

const NAME = 'ask'
const initialState: AskState = {
  amount: '',
  mintInfo: {
    address: '',
    decimals: 0,
  },
  accountAddress: '',
  poolAddresses: [],
  priority: 0,
}

/**
 * Actions
 */

export const updateAskData = createAsyncThunk<
  Partial<AskState>,
  Partial<AskState> & { prioritized?: boolean; reset?: boolean },
  { state: any }
>(
  `${NAME}/updateAskData`,
  async ({ prioritized, reset, ...askData }, { getState }) => {
    const {
      bid: { priority: refPriority },
      ask: { priority: prevPriority },
    } = getState()
    if (Number(askData.amount) < 0) askData.amount = ''
    const priority = reset ? 0 : prioritized ? refPriority + 1 : prevPriority
    return { ...askData, priority }
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
      updateAskData.fulfilled,
      (state, { payload }) => void Object.assign(state, payload),
    ),
})

export default slice.reducer
