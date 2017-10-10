import {
  createStore,
  applyMiddleware,
  compose
} from 'redux'
import coMiddleware from 'redux-co'
import createLogger from 'redux-logger'
import rootReducer from '../reducers'

const configureStore = (initialState) => {
  const enhancer = compose(
    // (process.env.NODE_ENV === 'development') ? applyMiddleware(coMiddleware, createLogger()) : applyMiddleware(coMiddleware)
    (process.env.NODE_ENV === 'development') ? applyMiddleware(coMiddleware) : applyMiddleware(coMiddleware)
  )
  const store = createStore(rootReducer, initialState, enhancer)
  if (module.hot) {
    module.hot.accept(() => {
      const nextRootReducer = require('../reducers/index').default
      store.replaceReducer(nextRootReducer)
    })
  }
  return store
}

export default configureStore
