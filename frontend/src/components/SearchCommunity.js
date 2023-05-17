import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchCommunityByName } from '../Api'; // Substitua por sua localização de arquivo real

const SearchCommunity = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const results = await searchCommunityByName(searchQuery);
      navigate('/search', { state: { results } }); // Navegar para a página de resultados com os resultados da pesquisa
    } catch (error) {
      console.error('Erro ao pesquisar comunidade:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Pesquisar comunidade"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit">Pesquisar</button>
      </form>
    </div>
  );
};

export default SearchCommunity;
