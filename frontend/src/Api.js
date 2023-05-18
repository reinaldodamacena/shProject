import axios from 'axios';
import { API_BASE_URL,LOGIN_ROUTE, POSTS_ROUTE, FEED_USER_ROUTE, PROFILE_ROUTE, PROFILE_CONN, CHAT_ROUTE,COMMUNITY_ROUTE} from './apiRoutes';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = async (username, password) => {
  try {
    const response = await api.post(LOGIN_ROUTE, { username, password });
    if (response.status === 200 && response.data && response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      return response.data;
    } else {
      throw new Error('Erro de autenticação');
    }
  } catch (error) {
    throw new Error('Erro de autenticação: ' + error.message);
  }
};


export const createPost = async (formData) => {
  try {
    const authToken = localStorage.getItem('authToken');
    const response = await api.post(POSTS_ROUTE, formData, {
      headers: {
        Authorization: `Token ${authToken}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.status === 201) {
      return response.data;
    } else {
      throw new Error('Erro ao criar a publicação');
    }
  } catch (error) {
    throw new Error('Erro ao criar a publicação: ' + error.message);
  }
};

export const getPosts = async () => {
  try {
    const response = await api.get(POSTS_ROUTE);
    return response.data;
  } catch (error) {
    throw new Error('Erro ao obter posts');
  }
};

export const getFeedData = async () => {
  try {
    const authToken = localStorage.getItem('authToken');
    console.log(authToken)
    const response = await api.get(FEED_USER_ROUTE, {
      headers: {
        Authorization: `Token ${authToken}`,
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Erro ao obter o feed do usuário');
    }
  } catch (error) {
    throw new Error('Erro ao obter o feed do usuário: ' + error.message);
  }
};

export const getProfileData = async (authToken) => {
  try {
    const response = await api.get(PROFILE_ROUTE, {
      headers: {
        Authorization: `Token ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Erro ao obter as informações do perfil: ' + error.message);
  }
};

export const getConnectedProfiles = async () => {
  try {
    const authToken = localStorage.getItem('authToken');
    const response = await api.get(PROFILE_CONN, {
      headers: {
        Authorization: `Token ${authToken}`,
      },
    });

    return response.data;
  } catch (error) {
    throw new Error('Erro ao obter perfis conectados: ' + error.message);
  }
};


export const connectToChat = (roomName, senderId, receiverId, token, onMessageReceived) => {
  console.log('Inside connectToChat, onMessageReceived is:', onMessageReceived);
  console.log('Type of onMessageReceived:', typeof onMessageReceived);
  
  const wsScheme = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const wsURL = `${wsScheme}//${window.location.hostname}:8000/ws/chat/${roomName}/${senderId}/${receiverId}/?token=${token}`;
  console.log('Connecting to WebSocket at URL:', wsURL);
  const socket = new WebSocket(wsURL);

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log('Inside onmessage, onMessageReceived is:', onMessageReceived);
      console.log('Type of onMessageReceived:', typeof onMessageReceived);
      onMessageReceived(data);
    } catch (error) {
      console.error('Failed to parse message data:', event.data, 'Error:', error);
    }
  }

  return socket;
};

export const getCommunitiesOfLoggedInUser = async () => {
  try {
    const authToken = localStorage.getItem('authToken');
    const response = await api.get(COMMUNITY_ROUTE, {
      headers: {
        Authorization: `Token ${authToken}`,
      },
    });

    return response.data;
  } catch (error) {
    throw new Error('Erro ao obter comunidades do usuário logado: ' + error.message);
  }
};

export const getCommunityDetails = async (id) => {
  try {
    const authToken = localStorage.getItem('authToken');
    const response = await api.get(`${COMMUNITY_ROUTE}${id}/`, {
      headers: {
        Authorization: `Token ${authToken}`,
      },
    });

    return response.data;
  } catch (error) {
    throw new Error('Erro ao obter detalhes da comunidade: ' + error.message);
  }
};

export const createPostCommunity = async (formData, id) => {
  try {
    const authToken = localStorage.getItem('authToken');
    const response = await api.post(`${COMMUNITY_ROUTE}${id}/posts/`, formData, {
      headers: {
        Authorization: `Token ${authToken}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.status === 201) {
      return response.data;
    } else {
      throw new Error('Erro ao criar a publicação na comunidade');
    }
  } catch (error) {
    throw new Error('Erro ao criar a publicação na comunidade: ' + error.message);
  }
};

export const searchCommunityByName = async()=>{
  return
};

<<<<<<< HEAD
export const getCommunityCreator = async (communityId) => {
  try {
    const authToken = localStorage.getItem('authToken');
    const response = await api.get(`${COMMUNITY_ROUTE}${communityId}/creator/`, {
      headers: {
        Authorization: `Token ${authToken}`,
      },
    });

    return response.data;
  } catch (error) {
    throw new Error('Erro ao obter o criador da comunidade: ' + error.message);
  }
};

export const getCommunityMembers = async (communityId) => {
  try {
    const authToken = localStorage.getItem('authToken');
    const response = await api.get(`${COMMUNITY_ROUTE}${communityId}/members/`, {
      headers: {
        Authorization: `Token ${authToken}`,
      },
    });

    return response.data;
  } catch (error) {
    throw new Error('Erro ao obter os membros da comunidade: ' + error.message);
  }
};
=======
export const getCommunityPosts = async () =>
{
  return
};
>>>>>>> b6ad0c28c80e76c967ba39c5e12e5f8a01ed7e60
