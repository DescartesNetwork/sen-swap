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
export const updateAskData = createAsyncThunk<
  Partial<State>,
  Partial<State> & { prioritized?: boolean; reset?: boolean },
  { state: any }
>(
  `${NAME}/updateAskData`,
  async ({ prioritized, reset, ...askData }, { getState }) => {
    const {
      bid: { priority: refPriority },
      ask: { priority: prevPriority },
    } = getState()
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
