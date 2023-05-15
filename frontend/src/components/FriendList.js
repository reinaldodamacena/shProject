import React, { useEffect, useState } from 'react';
import { getConnectedProfiles, connectToChat, getProfileData } from '../Api';
import { CHAT_ROUTE } from '../apiRoutes';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';

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

const FriendList = () => {
  const [connections, setConnections] = useState([]);
  const [profileData, setProfileData] = useState(null);

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

const handleConnectToChat = (connection) => {
  const name = connection.user.username;
  const senderId = profileData ? profileData.id : null; // ID do usuário logado
  const receiverId = connection.id; // ID da conexão

  console.log('name:', name);
  console.log('senderId:', senderId);
  console.log('receiverId:', receiverId);

  if (name && senderId && receiverId) {
    const wsScheme = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const formattedRoomName = name.replace(/\W/g, '');
    const wsURL = `${wsScheme}//${window.location.host}/ws/chat/${formattedRoomName}/${senderId}/${receiverId}/`;
    connectToChat(wsURL, senderId, receiverId, onMessageReceived);
    console.log('Connection established:', name);
  }
};


  const onMessageReceived = (message) => {
    // Tratar a mensagem recebida
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
                  <Avatar alt={connection.user.username} src={''}/>  
                </StyledBadge>  
              </ListItemAvatar>
              <ListItemText
                primary={connection.user.username}
              />
            </ListItem>
            
          ))}
        </List>
    </div>
  );
};

export default FriendList;
