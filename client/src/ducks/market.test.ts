import { call, put, take } from 'redux-saga/effects';
import { marketActions, marketSagas, marketServices } from './market';

it('start saga executes correctly', () => {
  const gen = marketSagas.start();

  expect(gen.next().value).toEqual(call(marketServices.subscribe));
  const channel = marketServices.subscribe();
  expect(gen.next(channel).value).toEqual(take(channel));
  const action = marketActions.internal.update({
    id: 0,
    timestamp: 0,
    data: { price: 0, volume: 0 }
  });
  expect(gen.next(action).value).toEqual(put(action));
  expect(gen.next(channel).value).toEqual(take(channel));
});
