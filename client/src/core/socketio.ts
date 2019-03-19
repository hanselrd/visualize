import io from 'socket.io-client';

const socket = io(
  `http://${document.domain}:${Number.parseInt(location.port, 10) !== 3000 ? location.port : 5000}`
);

export default socket;
