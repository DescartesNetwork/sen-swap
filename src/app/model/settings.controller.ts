import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export type State = {
  slippage: number
  advanced: boolean
}

const NAME = 'sen-swap'
const initialState: State = {
  slippage: 0.01,
  advanced: false,
}

/**
 * Actions
 */

export const updateSettings = createAsyncThunk(
  `${NAME}/updateSettings`,
  async (settings: Partial<State>) => {
    return settings
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
      updateSettings.fulfilled,
      (state, { payload }) => void Object.assign(state, payload),
    ),
})

export default slice.reducer
