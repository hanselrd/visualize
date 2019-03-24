import io from 'socket.io-client';

const URL = `http://${document.domain}:${
  Number.parseInt(location.port, 10) !== 3000 ? location.port : 5000
}`;

const socket = io(URL);
export const chatSocket = io(`${URL}/message`);
export const marketSocket = io(`${URL}/market`);
