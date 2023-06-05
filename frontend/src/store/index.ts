import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducers from './modules/index';

// const middleWares = [thunkMiddleware];
declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()
    : compose;

// const enhancer = composeEnhancers(
//   applyMiddleware(...middleWares)
// );

export const store = createStore(
  reducers,
  composeEnhancers(applyMiddleware(thunk))
);
