import { Reducer } from 'redux';
import { eventChannel } from 'redux-saga';
import { all, call, put, take, takeLatest } from 'redux-saga/effects';
import { ActionType, createAction, getType } from 'typesafe-actions';
import socket from '../core/socketio';

enum Trigger {
  NONE = 0,
  OPEN = 1 << 0,
  CLOSE = 1 << 1,
  LOW = 1 << 2,
  HIGH = 1 << 3,
  VWAP = 1 << 4,
  ALL = OPEN | CLOSE | LOW | HIGH | VWAP
}

interface IBookUpdate {
  price: number;
  volume: number;
}

interface IBook {
  deltas: IBookUpdate[];
  vwap: number;
  total_volume: number;
}

interface IMarketData {
  id: number;
  timestamp: number;
  data: IBookUpdate;
}

export const marketActions = {
  internal: {
    update: createAction('@@market/UPDATE', action => (md: IMarketData) => action(md))
  },
  start: createAction('@@market/START', action => () => action())
};

export type MarketAction = ActionType<typeof marketActions>;

export const marketServices = {
  subscribe: () =>
    eventChannel(emit => {
      socket.emit('market_subscribe');

      socket.on('market_data', (md: IMarketData) => {
        emit(marketActions.internal.update(md));
      });

      return () => {};
    })
};

export const marketSagas = {
  *start() {
    const channel = yield call(marketServices.subscribe);
    while (true) {
      const action = yield take(channel);
      yield put(action);
    }
  }
};

export const marketSaga = function*() {
  yield all([takeLatest(getType(marketActions.start), marketSagas.start)]);
};

export type MarketState = Readonly<{ book: IBook }>;

const reducer: Reducer<MarketState, MarketAction> = (
  state: MarketState = {
    book: { deltas: [], vwap: 0, total_volume: 0 }
  },
  action: MarketAction
) => {
  switch (action.type) {
    case getType(marketActions.internal.update):
      return {
        ...state,
        book: {
          ...state.book,
          deltas: [...state.book.deltas, action.payload.data],
          vwap:
            (state.book.vwap * state.book.total_volume +
              action.payload.data.price * action.payload.data.volume) /
            (state.book.total_volume + action.payload.data.volume),
          total_volume: state.book.total_volume + action.payload.data.volume
        }
      };
    default:
      return state;
  }
};

export default reducer;
