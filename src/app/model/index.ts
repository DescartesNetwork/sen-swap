import { configureStore } from '@reduxjs/toolkit'
import { devTools, bigintSerializationMiddleware } from 'shared/devTools'

import main from './main.controller'
import ask from './ask.controller'
import bid from './bid.controller'
import settings from './settings.controller'
import route from './route.controller'

/**
 * Isolated store
 */
const model = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware(bigintSerializationMiddleware),
  devTools: devTools('myapp'),
  reducer: {
    main,
    ask,
    bid,
    settings,
    route,
  },
})

export type AppState = ReturnType<typeof model.getState>
export type AppDispatch = typeof model.dispatch
export default model
