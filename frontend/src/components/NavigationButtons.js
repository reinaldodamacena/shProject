import React from 'react';

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
      <button>Conexões</button>
      {/* Botão Comunidade */}
      <button>Comunidade</button>
      {/* Botão Sair */}
      <button onClick={handleLogout}>Sair</button>
    </nav>
  );
};

export default NavigationButtons;
