import { configureStore } from '@reduxjs/toolkit'
import { devTools, bigintSerializationMiddleware } from 'shared/devTools'

import ask from './ask.controller'
import bid from './bid.controller'
import settings from './settings.controller'
import route from './route.controller'
import history from './history.controller'

/**
 * Isolated store
 */
const model = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware(bigintSerializationMiddleware),
  devTools: devTools('myapp'),
  reducer: {
    ask,
    bid,
    settings,
    route,
    history,
  },
})

export type AppState = ReturnType<typeof model.getState>
export type AppDispatch = typeof model.dispatch
export default model
