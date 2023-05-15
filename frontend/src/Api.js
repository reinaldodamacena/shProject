import axios from 'axios';
import { API_BASE_URL,LOGIN_ROUTE, POSTS_ROUTE, FEED_USER_ROUTE, PROFILE_ROUTE, PROFILE_CONN, CHAT_ROUTE } from './apiRoutes';

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


export function connectToChat(roomName, senderId, receiverId, onMessageReceived) {
  const wsScheme = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const formattedRoomName = roomName.replace(/\W/g, '');
  let wsURL = `${wsScheme}//${window.location.hostname}:8000${CHAT_ROUTE}${formattedRoomName}/`;

  if (senderId && receiverId) {
    wsURL += `${senderId}/${receiverId}/`;
  }

  const socket = new WebSocket(wsURL);

  socket.onmessage = (event) => {
    onMessageReceived(JSON.parse(event.data));
  };

  return socket;
}


