import React, { useEffect, useRef, useState } from 'react';
import { connectToChat } from '../Api';
import { CHAT_ROUTE } from '../apiRoutes';

const Chat = ({ match, senderId, receiverId, wsScheme, onMessageReceived }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const socketRef = useRef(null);
  const roomName = match?.params?.roomName || null;

  useEffect(() => {
    if (roomName && senderId && receiverId) {
      const wsURL = `${wsScheme}//${window.location.host}${CHAT_ROUTE}${senderId}/${receiverId}/`;
      socketRef.current = connectToChat(wsURL, onMessageReceived);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [roomName, senderId, receiverId, wsScheme, onMessageReceived]);

  function handleInputKeyPress(event) {
    if (event.key === 'Enter') {
      const message = { message: inputValue };
      socketRef.current.send(JSON.stringify(message));
      setInputValue('');
    }
  }

  return (
    <div>
      <h1>Chat: {roomName}</h1>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message.message}</li>
        ))}
      </ul>
      <input value={inputValue} onChange={(event) => setInputValue(event.target.value)} onKeyPress={handleInputKeyPress} />
    </div>
  );
};

export default Chat;
