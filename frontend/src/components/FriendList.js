import React, { useEffect, useState } from 'react';
import { getConnectedProfiles } from '../Api';
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

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const data = await getConnectedProfiles();
        setConnections(data);
      } catch (error) {
        console.error('Erro ao obter as conexões:', error);
      }
    };

    fetchConnections();
  }, []);

  return (
    <div className="friend-list">
        <List>{connections.map(connection =>(
          <ListItem secondaryAction={
            <IconButton edge="end" aria-label="message">
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
              primary = {connection.user.first_name}
            />
          </ListItem>
        ))}            
        </List>
    </div>
  );
};

export default FriendList;

