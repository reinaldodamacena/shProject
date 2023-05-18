import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getConnectedProfiles, connectToChat, getProfileData } from '../Api';
import { API_BASE_URL, CHAT_ROUTE } from '../apiRoutes';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import './FriendList.css'




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

const FriendList = ({ setActiveChat }) => {
  const [connections, setConnections] = useState([]);
  const [profileData, setProfileData] = useState(null);
  // const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const data = await getConnectedProfiles();
        setConnections(data);
        console.log('profileData:', data);
      } catch (error) {
        console.error('Erro ao obter as conexões:', error);
      }
    };

    const fetchProfileData = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        console.log('authToken:', authToken);
        const data = await getProfileData(authToken);
        console.log('profileData:', data);
        setProfileData(data);
      } catch (error) {
        console.log(error);
      }
    };
    
    fetchConnections();
    fetchProfileData();
  }, []);
  const onMessageReceived = (message) => {
    console.log('Received message:', message);
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const handleConnectToChat = (connection) => {
    const senderId = profileData ? profileData.id : null; // ID do usuário logado
    const receiverId = connection.id; // ID da conexão
    const token = localStorage.getItem('authToken'); // Recupere o token aqui
    const receiver_first_name = connection.user.first_name;
    const avatarSender = profileData.avatar;
    const avatarReceiver = connection.avatar;


    console.log('senderId:', senderId);
    console.log('receiverId:', receiverId);
    console.log('token:',token);
    console.log('receiverName', receiver_first_name);
    console.log("avatares", avatarSender);
    console.log("avaters!", avatarReceiver);

    if (senderId && receiverId && token) {
      const wsScheme = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const formattedRoomName = [senderId, receiverId].sort().join('_');
      // let wsURL = `${wsScheme}//${window.location.hostname}:8000${CHAT_ROUTE}${formattedRoomName}/`;
      connectToChat(formattedRoomName, senderId, receiverId, token, onMessageReceived);
    
      console.log('Connection established:', connection);
    
      setActiveChat({ name: formattedRoomName, senderId, receiverId, receiver_first_name, avatar_sender: avatarSender, avatar_receiver: avatarReceiver });

    }
  };


  return (
    <div className="friend-list">
      <List>
          {connections.map(connection =>(
       <ListItem key={connection.id} secondaryAction={
        <IconButton edge="end" aria-label="mensagem" onClick={() => handleConnectToChat(connection)}>
            <ChatBubbleOutlineIcon />
        </IconButton>
      }>
      
              <ListItemAvatar>
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  variant="dot"
                >
                  <Avatar alt={connection.user.username} src={connection.avatar}/>  
                </StyledBadge>  
              </ListItemAvatar>
              <ListItemText
                primary={connection.user.first_name}
              />
            </ListItem>
            
          ))}
        </List>
    </div>
  );
};

export default FriendList;
