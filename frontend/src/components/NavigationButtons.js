import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import './NavigationButtons.css';

const NavigationButtons = ({ isOnCommunityPage, onToggleCommunities }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remover o token de autenticação do localStorage
    localStorage.removeItem('authToken');

    // Redirecionar o usuário para a página de login ou para a página inicial não autenticada
    navigate('/login');
  };

  const handleTogglePage = () => {
    onToggleCommunities();
  };

  return (
    <div>
      <nav className="navigation-buttons">
        {/* Botão Conexões */}
        <Button variant="outlined">Conexões</Button>
        {/* Botão Comunidade ou Feed */}
        <Button variant="outlined" onClick={handleTogglePage}>
          {isOnCommunityPage ? 'Feed' : 'Comunidade'}
        </Button>
        {/* Botão Sair */}
        <Button variant="outlined" onClick={handleLogout}>Sair</Button>
      </nav>
    </div>
  );
};

export default NavigationButtons;
