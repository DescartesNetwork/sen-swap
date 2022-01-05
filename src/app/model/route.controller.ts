import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RouteTrace } from 'app/helper/router'

export type State = {
  best: RouteTrace
  amounts: bigint[]
  amount: bigint
}

const NAME = 'route'
const initialState: State = {
  amount: BigInt(0),
  amounts: [],
  best: [],
}

/**
 * Actions
 */
export const updateRoute = createAsyncThunk<
  Partial<State>,
  Partial<State>,
  { state: any }
>(`${NAME}/updateRoute`, async (route, { getState }) => {
  const { route: prevRoute } = getState()
  if (!route) return { ...prevRoute }
  return { ...prevRoute, ...route }
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
      updateRoute.fulfilled,
      (state, { payload }) => void Object.assign(state, payload),
    ),
})

export default slice.reducer
