import React, { useEffect, useRef, useState } from 'react';
import { connectToChat } from '../Api';
import { CHAT_ROUTE } from '../apiRoutes';
import { useLocation } from 'react-router-dom';
import { ChatContainer, MessageList, Message, Input, SendButton } from './ChatStyle';
import SendIcon from '@mui/icons-material/Send';

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
  onMessageReceivedRef.current = (messageData) => {
    console.log('Received message data:', messageData);
    
    let message;
    
    if (typeof messageData === 'string') {
      message = JSON.parse(messageData);
    } else 
    if (typeof messageData === 'object') {
      message = messageData;
    } else {
      console.error('Unexpected type of messageData:', typeof messageData);
      return;
    }
  
    console.log('Parsed message:', message);
    
    if (message.command === 'messages') {
      setMessages(message.messages);
    } else {
      setMessages((prevMessages) => [...prevMessages, message]);
    }
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
    <ChatContainer>
      <h1>Chat: {roomName}</h1>
      <MessageList>
        {messages.map((message, index) => (
          <Message key={index}>
            <strong>{message.sender_first_name}: </strong>
            {message.content}
          </Message>
        ))}
      </MessageList>
      <div>
        <Input
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
        />
        <SendButton onClick={handleSendMessage} startIcon={<SendIcon />}>
          Enviar
        </SendButton>
      </div>
    </ChatContainer>


  );
};

export default Chat;
