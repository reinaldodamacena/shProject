import React, { useEffect, useRef, useState } from 'react';
import { connectToChat } from '../Api';
import { CHAT_ROUTE } from '../apiRoutes';

const Chat = ({ match }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const socketRef = useRef(null);
  const roomName = match?.params?.roomName || null;


  useEffect(() => {
    // Conecta ao WebSocket
    socketRef.current = connectToChat(roomName, (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    }, (error) => {
      console.error(error);
      alert('Ocorreu um erro ao conectar ao chat. Tente novamente mais tarde.');
    });

    return () => {
      // Fecha a conexão ao desmontar o componente
      socketRef.current.close();
    };
  }, [roomName]);

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
