import React, { useEffect, useRef, useState } from 'react';
import { connectToChat } from '../Api';
import { CHAT_ROUTE } from '../apiRoutes';
import { useHistory } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Input from '@mui/material/Input';
import { IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import './Chat.css'

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));



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

  const listRef = useRef(null);
  useEffect(() => {
    // Função para fazer o scroll para a mensagem mais recente
    const scrollToBottom = () => {
      if (listRef.current) {
        listRef.current.scrollTop = listRef.current.scrollHeight;
      }
    };

    // Chama a função ao atualizar as mensagens
    scrollToBottom();
  }, [messages]);

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
      
      <Typography variant="h6" className="chat-header">
        <div>
        <StyledBadge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          variant="dot"
        >
          <Avatar alt={receiverName} src={avatarReceiver} sx={{ width: 56, height: 56 }}/>  
        </StyledBadge> 
      {receiverName}</div>
      <IconButton className='close-icon' color="background: #00000099;" onClick={handleSendMessage}>
          <CloseIcon className='i-close' />
      </IconButton>
      </Typography>
      <List ref={listRef} className="message-list">
        {messages.map((message, index) => (
          <ListItem key={index} sx={{ width: '80%' }} className={`message ${message.sender_id === senderId ? 'message--sent' : 'message--received'}`}>
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
        <Input
          placeholder="Digite sua mensagem" 
          variant="soft"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          endDecorator={IconButton}
        />
        <IconButton className='send-icon' color="background: #00000099;" onClick={handleSendMessage}>
          <SendIcon className='icon-s' />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Chat;
