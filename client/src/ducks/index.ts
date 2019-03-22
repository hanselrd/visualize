import { combineReducers } from 'redux';
import { all, fork } from 'redux-saga/effects';
import chatReducer, { ChatAction, chatSaga, ChatState } from './chat';
import marketReducer, { MarketAction, marketSaga, MarketState } from './market';

export const rootSaga = function*() {
  yield all([fork(chatSaga), fork(marketSaga)]);
};

export type RootState = Readonly<{ chat: ChatState; market: MarketState }>;
export type RootAction = ChatAction & MarketAction;

export default combineReducers<RootState, RootAction>({ chat: chatReducer, market: marketReducer });
