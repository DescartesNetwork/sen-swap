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
  loadingJupSwap?: boolean
  loadingSenswap?: boolean
}

const NAME = 'route'
const initialState: RouteState = {
  platform: SwapPlatform.SenSwap,
  best: [],
  amount: BigInt(0),
  priceImpact: 0,
  loadingJupSwap: false,
  loadingSenswap: false,
}

/**
 * Actions
 */

export const setLoadingJupiterRoute = createAsyncThunk<
  Partial<RouteState>,
  Partial<RouteState>,
  { state: any }
>(`${NAME}/setLoadingJupiterRoute`, async ({ loadingJupSwap }) => {
  return { loadingJupSwap }
})

export const setLoadingSenSwap = createAsyncThunk<
  Partial<RouteState>,
  Partial<RouteState>,
  { state: any }
>(`${NAME}/loadingSenswap`, async ({ loadingSenswap }) => {
  return { loadingSenswap }
})

export const updateRoute = createAsyncThunk<
  Partial<RouteState>,
  Partial<RouteState>,
  { state: any }
>(`${NAME}/updateRoute`, async (route) => {
  if (!route) return {}
  return { ...route }
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
      )
      .addCase(
        setLoadingSenSwap.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
