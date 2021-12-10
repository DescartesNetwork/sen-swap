import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { HopData } from 'app/components/preview/index'

type RouteInfo = {
  hops: HopData[]
  amounts: string[]
  amount: string
}

export type State = {
  route?: RouteInfo
}
const ROUTE_DEFAULT = {
  amount: '',
  amounts: [],
  hops: [],
}
const NAME = 'sen-swap'
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
