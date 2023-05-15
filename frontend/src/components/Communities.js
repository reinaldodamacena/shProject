import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCommunitiesOfLoggedInUser, searchCommunityByName } from '../Api'; // Substitua por sua localização de arquivo real
import SearchCommunity from './SearchCommunity';
import './Communities.css';

const Communities = () => {
  const [communities, setCommunities] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();

  const goToCommunity = (id) => {
    navigate(`/comunidade/${id}`);
  };

  const handleSearch = async (results) => {
    setCommunities(results);
  };

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
      <SearchCommunity onSearch={handleSearch} />

      {communities.map((community) => (
        <div key={community.id} className="community" onClick={() => goToCommunity(community.id)}>
          <h1>{community.name}</h1>
          <p>{community.description}</p>
          <p>Quantidade de membros: {community.members.length}</p>
        </div>
      ))}
      <button className="pagination-button" disabled={!hasMore} onClick={() => setPage((prev) => prev + 1)}>
        Carregar mais
      </button>
    </div>
  );
};

export default Communities;
