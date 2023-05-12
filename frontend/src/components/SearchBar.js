import React from 'react';
import TextField from '@mui/material/TextField';
import './SearchBar.css'

const SearchBar = () => {
  return (
    <div className="search-bar">
      {/* Barra de busca */}
      <TextField type="text" placeholder="Procurar por conexões" />
    </div>
  );
};

export default SearchBar;