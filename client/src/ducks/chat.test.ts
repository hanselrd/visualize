import { call, put, take } from 'redux-saga/effects';
import socket from '../core/socketio';
import { chatActions, chatSagas, chatServices } from './chat';

it('start saga executes correctly', () => {
  const gen = chatSagas.start();

  expect(gen.next().value).toEqual(call(chatServices.subscribe));
  const channel = chatServices.subscribe();
  expect(gen.next(channel).value).toEqual(take(channel));
  const action = chatActions.internal.messageAdded(0, { sid: '1', text: '', created: 1 });
  expect(gen.next(action).value).toEqual(put(action));
  expect(gen.next(channel).value).toEqual(take(channel));
});

it('sendMessage saga executes correctly', () => {
  const action = chatActions.sendMessage('test');
  const gen = chatSagas.sendMessage(action);

  expect(gen.next().value).toEqual(call([socket, socket.emit], 'message_add', action.payload));
  expect(gen.next().done).toEqual(true);
});
