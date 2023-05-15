import React, { useState, useEffect } from 'react';
import { getCommunitiesOfLoggedInUser } from '../Api'; 

const CommunityList = () => {
  const [communities, setCommunities] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const data = await getCommunitiesOfLoggedInUser();
        setCommunities(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCommunities();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Comunidades</h2>
      <ul>
        {communities.map((community) => (
          <li key={community.id}>{community.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default CommunityList;