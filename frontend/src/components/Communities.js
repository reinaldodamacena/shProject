import React, { useState, useEffect } from 'react';
import { getCommunitiesOfLoggedInUser } from '../Api'; // Substitua por sua localização de arquivo real
import './Communities.css';

const PaginatedCommunities = () => {
  const [communities, setCommunities] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      const data = await getCommunitiesOfLoggedInUser(page);
      setCommunities((prev) => [...prev, ...data]);
      setHasMore(data.length > 0);
    };

    fetchPage();
  }, [page]);

  return (
    <div className="communities-container">
      {communities.map((community) => (
        <div key={community.id} className="community">
          <h1>{community.name}</h1>
          <p>{community.description}</p>
          <p>{community.members.length}</p>
        </div>
      ))}
      <button className="pagination-button" disabled={!hasMore} onClick={() => setPage((prev) => prev + 1)}>
        Carregar mais
      </button>
    </div>
  );
};

export default PaginatedCommunities;
