import React, { useEffect, useRef, useState } from 'react';
import { connectToChat } from '../Api';
import { CHAT_ROUTE } from '../apiRoutes';
import { useHistory } from 'react-router-dom';



const Chat = ({ activeChat }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const socketRef = useRef(null);
  const roomName = activeChat?.name || null;
  const senderId = activeChat?.senderId || null;
  const receiverId = activeChat?.receiverId || null;
  const token = localStorage.getItem('authToken');
  const receiverName = activeChat?.receiver_first_name || null;
  const avatarSender = activeChat.avatar_sender; 
  const avatarReceiver = activeChat.avatar_receiver ;

  console.log('passando os avataresSender', avatarSender);
  console.log('passando os avataresReceiver:', avatarReceiver);

  const onMessageReceivedRef = useRef();
  onMessageReceivedRef.current = (messageData) => {
    console.log('Received message data:', messageData);
  
    let message;
  
    if (typeof messageData === 'string') {
      message = JSON.parse(messageData);
    } else if (typeof messageData === 'object') {
      message = messageData;
    } else {
      console.error('Unexpected type of messageData:', typeof messageData);
      return;
    }
  
    console.log('Parsed message:', message);
  
    if (message.command === 'messages') {
      // Adicionar informações do avatar às mensagens recebidas
      const messagesWithAvatars = message.messages.map(msg => {
        if(msg.sender_id === senderId) {
          return {...msg, avatar: avatarSender};
        } else if(msg.sender_id === receiverId) {
          return {...msg, avatar: avatarReceiver};
        } else {
          return msg;
        }
      });
      setMessages(messagesWithAvatars);
    } else {
      // Adicionar informações do avatar à nova mensagem
      const newMessage = message;
      if(newMessage.sender_id === senderId) {
        newMessage.avatar = avatarSender;
      } else if(newMessage.sender_id === receiverId) {
        newMessage.avatar = avatarReceiver;
      }
      setMessages((prevMessages) => [...prevMessages, newMessage]);
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
        <div className="chat-container">
        <h1 className="chat-header">Chat: {receiverName}</h1>
        <div className="message-list">
        {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender_id === senderId ? 'message--sent' : 'message--received'}`}>
                <img className="message__avatar" src={message.sender_id === senderId ? avatarSender : (message.sender_id === receiverId ? avatarReceiver : null)} alt="User avatar"/>
                <div className="message__content">
                    <strong>{message.sender_first_name}: </strong>
                    {message.content}
                </div>
            </div>
        ))}

        </div>
        <div className="message-input">
          <input 
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
          />
          <button onClick={handleSendMessage}>
            Enviar
          </button>
        </div>
      </div>
  );
};

export default Chat;
