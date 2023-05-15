import React, { useEffect, useRef, useState } from 'react';
import { connectToChat } from '../Api';
import { CHAT_ROUTE, API_BASE_URL } from '../apiRoutes';

const Chat = ({ match, senderId, receiverId }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const socketRef = useRef(null);
  const roomName = match?.params?.roomName || null;

  const onMessageReceived = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  useEffect(() => {
    const wsScheme = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsHostname = window.location.hostname;
    const wsURL = `${wsScheme}//${wsHostname}:8000${CHAT_ROUTE}${roomName}/${senderId}/${receiverId}/`;

    if (roomName && senderId && receiverId) {
      socketRef.current = connectToChat(wsURL, onMessageReceived);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [roomName, senderId, receiverId]);

  const handleInputKeyPress = (event) => {
    if (event.key === 'Enter' && socketRef.current) {
      const messageObject = {
        message: inputValue,
        receiver_id: receiverId
      };
      socketRef.current.send(JSON.stringify(messageObject));
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
      <input 
        value={inputValue} 
        onChange={(event) => setInputValue(event.target.value)} 
        onKeyPress={handleInputKeyPress} 
      />
    </div>
  );
};

export default Chat;
