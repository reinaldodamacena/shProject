import React from 'react';
import Button from '@mui/material/Button';
import './NavigationButtons.css'

const NavigationButtons = () => {
  const handleLogout = () => {
    // Remover o token de autenticação do localStorage
    localStorage.removeItem('authToken');

    // Redirecionar o usuário para a página de login ou para a página inicial não autenticada
    window.location.href = '/login'; // Ou qualquer outro redirecionamento desejado
  };

  return (
    <nav className="navigation-buttons">
      {/* Botão Conexões */}
      <Button variant="outlined">Conexões</Button>
      {/* Botão Comunidade */}
      <Button variant="outlined">Comunidade</Button>
      {/* Botão Sair */}
      <Button variant="outlined" onClick={handleLogout}>Sair</Button>
    </nav>
  );
};

export default NavigationButtons;
