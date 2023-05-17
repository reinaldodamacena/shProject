import React from 'react';
import { useLocation } from 'react-router-dom';
import CommunityDetails from './CommunityDetails';

const SearchResults = () => {
  const location = useLocation();
  const results = location.state?.results || [];

  if (results.length === 0) {
    return <p>Nenhuma comunidade encontrada.</p>;
  }

  return (
    <div>
      {results.map((community) => (
        <CommunityDetails key={community.id} community={community} />
      ))}
    </div>
  );
};

export default SearchResults;
