import React, { useState } from 'react';
import CommunityList from './CommunityList'; // Substitua por sua localização de arquivo real

const NavigationButtons = () => {
  const [showCommunities, setShowCommunities] = useState(false);

  const handleLogout = () => {
    // Remover o token de autenticação do localStorage
    localStorage.removeItem('authToken');

    // Redirecionar o usuário para a página de login ou para a página inicial não autenticada
    window.location.href = '/login'; // Ou qualquer outro redirecionamento desejado
  };

  const toggleCommunityList = () => {
    setShowCommunities(!showCommunities);
  }

  return (
    <div>
      <nav className="navigation-buttons">
        {/* Botão Conexões */}
        <button>Conexões</button>
        {/* Botão Comunidade */}
        <button onClick={toggleCommunityList}>Comunidade</button>
        {/* Botão Sair */}
        <button onClick={handleLogout}>Sair</button>
      </nav>
      {showCommunities && <CommunityList />}
    </div>
  );
};

export default NavigationButtons;