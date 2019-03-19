import { Reducer } from 'redux';
import { eventChannel } from 'redux-saga';
import { all, call, put, take, takeLatest } from 'redux-saga/effects';
import { ActionType, createAction, getType } from 'typesafe-actions';
import socket from '../core/socketio';

interface IMessage {
  sid: string;
  text: string;
  created: number;
}

export const chatActions = {
  internal: {
    messageAdded: createAction('@@chat/MESSAGE_ADDED', action => (id: number, message: IMessage) =>
      action({ id, message })
    ),
    messageRemoved: createAction(
      '@@chat/MESSAGE_REMOVED',
      action => (id: number, message: IMessage) => action({ id, message })
    ),
    enabledUpdated: createAction('@@chat/ENABLED_UPDATED', action => (enabled: boolean) =>
      action(enabled)
    )
  },
  start: createAction('@@chat/START', action => () => action()),
  sendMessage: createAction('@@chat/SEND_MESSAGE', action => (text: string) => action(text)),
  deleteMessage: createAction('@@chat/DELETE_MESSAGE', action => (id: number) => action(id))
};

export type ChatAction = ActionType<typeof chatActions>;

export const chatServices = {
  subscribe: () =>
    eventChannel(emit => {
      socket.on('message_add', (data: { id: number; message: IMessage }) => {
        emit(chatActions.internal.messageAdded(data.id, data.message));
      });

      socket.on('message_remove', (data: { id: number; message: IMessage }) => {
        emit(chatActions.internal.messageRemoved(data.id, data.message));
      });

      return () => {};
    })
};

export const chatSagas = {
  *start() {
    const channel = yield call(chatServices.subscribe);
    while (true) {
      const action = yield take(channel);
      yield put(action);
    }
  },
  *sendMessage(action: ReturnType<typeof chatActions.sendMessage>) {
    yield call([socket, socket.emit], 'message_add', action.payload);
  }
  // deleteMessage: function*(action: ChatAction) {
  //     while (true) {
  //         const action: ReturnType<typeof chatActions.deleteMessage> =
  //         yield take(
  //             getType(chatActions.deleteMessage)
  //         );
  //         socket.emit('message_remove', action.payload);
  //     }
  // }
};

export const chatSaga = function*() {
  yield all([
    takeLatest(getType(chatActions.start), chatSagas.start),
    takeLatest(getType(chatActions.sendMessage), chatSagas.sendMessage)
    // takeLatest(getType(chatActions.deleteMessage),
    // chatSagas.deleteMessage)
  ]);
};

export type ChatState = Readonly<{ messages: IMessage[]; enabled: boolean }>;

const reducer: Reducer<ChatState, ChatAction> = (
  state: ChatState = {
    messages: [],
    enabled: false
  },
  action: ChatAction
) => {
  switch (action.type) {
    case getType(chatActions.internal.messageAdded):
      // return { ...state, [action.payload.id]: action.payload.message };
      return {
        ...state,
        messages: [...state.messages, action.payload.message]
      };
    case getType(chatActions.internal.messageRemoved):
      // const { [action.payload.id]: omit, ...messages } = state.messages;
      // return { ...state, messages };
      return { ...state };
    case getType(chatActions.internal.enabledUpdated):
      return { ...state, enabled: action.payload };
    default:
      return state;
  }
};

export default reducer;
