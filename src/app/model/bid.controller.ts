import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { TokenInfo } from '@solana/spl-token-registry'

export type State = {
  amount: string // Desired amount
  accountAddress: string // Associated account to the selected token
  mintInfo?: TokenInfo // Selected token
  poolAddress?: string // Selected pool (for advanced mode)
  poolAddresses: string[] // List of available pools
  priority: number
}

const NAME = 'sen-swap'
const initialState: State = {
  amount: '',
  accountAddress: '',
  poolAddresses: [],
  priority: 0,
}

/**
 * Actions
 */

export const updateBidData = createAsyncThunk<
  Partial<State>,
  Partial<State> & { prioritized?: boolean; reset?: boolean },
  { state: any }
>(
  `${NAME}/updateBidData`,
  async ({ prioritized, reset, ...bidData }, { getState }) => {
    const {
      bid: { priority: prevPriority },
      ask: { priority: refPriority },
    } = getState()
    if (Number(bidData.amount) < 0) bidData.amount = undefined
    const priority = reset ? 0 : prioritized ? refPriority + 1 : prevPriority
    return { ...bidData, priority }
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
      updateBidData.fulfilled,
      (state, { payload }) => void Object.assign(state, payload),
    ),
})

export default slice.reducer
