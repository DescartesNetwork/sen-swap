import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { HopData } from 'app/components/preview/index'

export type RouteInfo = {
  hops: HopData[]
  amounts: bigint[]
  amount: bigint
}

export type State = {
  route?: RouteInfo
}
const ROUTE_DEFAULT = {
  amount: BigInt(0),
  amounts: [],
  hops: [],
}
const NAME = 'route'
const initialState: State = {
  route: ROUTE_DEFAULT,
}

/**
 * Actions
 */
export const updateRouteInfo = createAsyncThunk<
  State,
  { route: RouteInfo },
  { state: any }
>(`${NAME}/updateRouteInfo`, async ({ route }, { getState }) => {
  const { route: routeState } = getState()
  if (!route) return { route: routeState }
  return { route }
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
      updateRouteInfo.fulfilled,
      (state, { payload }) => void Object.assign(state, payload),
    ),
})

export default slice.reducer
