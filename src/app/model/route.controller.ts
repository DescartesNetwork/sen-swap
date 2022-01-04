import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { HopData } from 'app/components/preview/index'

export type RouteInfo = {
  hops: HopData[]
  amounts: bigint[]
  amount: bigint
}

export type State = RouteInfo
const ROUTE_DEFAULT = {
  amount: BigInt(0),
  amounts: [],
  hops: [],
}
const NAME = 'route'
const initialState: State = {
  ...ROUTE_DEFAULT,
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
