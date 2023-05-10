import React, { useEffect, useState } from 'react';
import { getConnectedProfiles } from '../Api';

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
      <ul>
        {connections.map(connection => (
          <li key={connection.user.id}>{connection.user.username}</li>
        ))}
      </ul>
    </div>
  );
};

export default FriendList;

