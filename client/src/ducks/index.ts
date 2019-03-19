import { combineReducers } from 'redux';
import { all, fork } from 'redux-saga/effects';
import chatReducer, { ChatAction, chatSaga, ChatState } from './chat';

export const rootSaga = function*() {
  yield all([fork(chatSaga)]);
};

export type RootState = Readonly<{ chat: ChatState }>;
export type RootAction = ChatAction;

export default combineReducers<RootState, RootAction>({ chat: chatReducer });
