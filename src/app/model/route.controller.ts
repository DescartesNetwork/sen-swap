import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RouteTrace } from 'app/helper/router'

export enum SwapPlatform {
  SenSwap,
  JupiterAggregator,
}
export type RouteState = {
  platform: SwapPlatform
  best: RouteTrace // The best route
  amount: bigint
  priceImpact: number
  loadingJubRoute?: boolean
}

const NAME = 'route'
const initialState: RouteState = {
  platform: SwapPlatform.SenSwap,
  best: [],
  amount: BigInt(0),
  priceImpact: 0,
  loadingJubRoute: false,
}

/**
 * Actions
 */

export const setLoadingJupiterRoute = createAsyncThunk<
  Partial<RouteState>,
  Partial<RouteState>,
  { state: any }
>(`${NAME}/setLoadingJupiterRoute`, async ({ loadingJubRoute }) => {
  return { loadingJubRoute }
})

export const updateRoute = createAsyncThunk<
  Partial<RouteState>,
  Partial<RouteState>,
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
    void builder
      .addCase(
        updateRoute.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        setLoadingJupiterRoute.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
