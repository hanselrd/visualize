import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import './App.css';
import { RootState } from './ducks';
import { chatActions } from './ducks/chat';

type AppProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const App: React.FC<AppProps> = props => {
  const [text, setText] = useState('');

  useEffect(() => {
    props.chatStart();
  }, []);

  const sendHandler = () => {
    if (text.length > 0) {
      props.chatSendMessage(text);
      setText('');
    }
  };

  const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  return (
    <React.Fragment>
      <h1>App</h1>
      <div>
        <ul>
          {props.chat.messages.map((message, index) => (
            <li key={index}>
              [{message.sid}] {message.text}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <input type="text" value={text} onChange={inputHandler} />
        <button onClick={sendHandler}>Send</button>
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = (state: RootState) => state;

const mapDispatchToProps = {
  chatStart: chatActions.start,
  chatSendMessage: chatActions.sendMessage,
  chatDeleteMessage: chatActions.deleteMessage
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
