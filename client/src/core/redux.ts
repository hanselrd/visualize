import { applyMiddleware, createStore, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import logger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';

import rootReducer, { RootAction, rootSaga, RootState } from '../ducks';

let store: Store<RootState, RootAction>;

const sagaMiddleware = createSagaMiddleware();

if (process.env.NODE_ENV !== 'production') {
  store = createStore(rootReducer, composeWithDevTools(applyMiddleware(logger, sagaMiddleware)));
} else {
  store = createStore(rootReducer, applyMiddleware(sagaMiddleware));
}

sagaMiddleware.run(rootSaga);

export default store;
