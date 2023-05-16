import React, { useEffect, useRef, useState } from 'react';
import { connectToChat } from '../Api';
import { CHAT_ROUTE } from '../apiRoutes';
import { useLocation } from 'react-router-dom';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const socketRef = useRef(null);
  const location = useLocation();
  const roomName = location?.state?.name || null;
  const senderId = location?.state?.senderId || null;
  const receiverId = location?.state?.receiverId || null;
  const token = localStorage.getItem('authToken');

  const onMessageReceivedRef = useRef();
  onMessageReceivedRef.current = (message) => {
    console.log('Received message:', message);
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  useEffect(() => {    
    if (roomName && senderId && receiverId) {
      console.log('onMessageReceived function:', onMessageReceivedRef.current);
      socketRef.current = connectToChat(roomName, senderId, receiverId, token, onMessageReceivedRef.current);              
    }
  
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [roomName, senderId, receiverId]);
  


  const handleSendMessage = () => {
    if (inputValue.trim() !== '') {
      // Make sure the WebSocket is open before trying to send a message
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        const messageObject = {
          message: inputValue,
          receiver_id: receiverId,
        };
        console.log('Sending message:', messageObject);
        socketRef.current.send(JSON.stringify(messageObject));
        setInputValue('');
      } else {
        console.log('The WebSocket is not open.');
      }
    }
  };
  

  console.log('Room Name:', roomName);
  console.log('Sender ID:', senderId);
  console.log('Receiver ID:', receiverId);

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
      />
      <button onClick={handleSendMessage}>Enviar</button>
    </div>
  );
};

export default Chat;
