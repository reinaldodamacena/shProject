import React, { useEffect, useRef, useState } from 'react';
import { connectToChat } from '../Api';
import { CHAT_ROUTE } from '../apiRoutes';
import { useHistory } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

const Chat = ({ activeChat }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const socketRef = useRef(null);
  const roomName = activeChat?.name || null;
  const senderId = activeChat?.senderId || null;
  const receiverId = activeChat?.receiverId || null;
  const token = localStorage.getItem('authToken');
  const receiverName = activeChat?.receiver_first_name || null;
  const avatarSender = activeChat?.avatar_sender;
  const avatarReceiver = activeChat?.avatar_receiver;

  const onMessageReceivedRef = useRef();
  onMessageReceivedRef.current = (messageData) => {
    let message;

    if (typeof messageData === 'string') {
      message = JSON.parse(messageData);
    } else if (typeof messageData === 'object') {
      message = messageData;
    } else {
      console.error('Unexpected type of messageData:', typeof messageData);
      return;
    }

    if (message.command === 'messages') {
      const messagesWithAvatar = message.messages.map(msg => {
        let avatar;
        if (msg.sender_id === senderId) {
          avatar = avatarSender;
        } else {
          avatar = avatarReceiver;
        }
        return {
          ...msg,
          avatar: avatar
        };
      });
      setMessages(messagesWithAvatar);
    } else {
      let avatar;
      if (message.sender_id === senderId) {
        avatar = avatarSender;
      } else {
        avatar = avatarReceiver;
      }
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          ...message,
          avatar: avatar,
        },
      ]);
    }
  };

  useEffect(() => {
    if (roomName && senderId && receiverId) {
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
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        const messageObject = {
          message: inputValue,
          receiver_id: receiverId,
        };
        socketRef.current.send(JSON.stringify(messageObject));
        setInputValue('');
      } else {
        console.log('The WebSocket is not open.');
      }
    }
  };

  return (
    <Box className="chat-container">
      <Typography variant="h4" className="chat-header">Chat: {receiverName}</Typography>
      <List className="message-list">
        {messages.map((message, index) => (
          <ListItem key={index} className={`message ${message.sender_id === senderId ? 'message--sent' : 'message--received'}`}>
            <Avatar className="message__avatar" alt="User avatar" src={message.avatar || undefined} />
            <ListItemText
              primary={
                <>
                  <strong>{message.sender_first_name}: </strong>
                  {message.content}
                </>
              }
            />
          </ListItem>
        ))}
      </List>
      <Box className="message-input">
        <TextField
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleSendMessage}>
          Enviar
        </Button>
      </Box>
    </Box>
  );
};

export default Chat;
