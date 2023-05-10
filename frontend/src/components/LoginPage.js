import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../Api'; // Importe a função de login do arquivo Api.js

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Verifica se o usuário está autenticado (exemplo: verificando se há um token válido)
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      // Redireciona o usuário para a página principal
      navigate('/');
    }
  }, [navigate]);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Faz a requisição para obter o token de autenticação usando a função de login do arquivo Api.js
      const data = await login(username, password);
      const authToken = data.token;

      // Armazena o token de autenticação em algum local de armazenamento
      // como localStorage, contexto ou estado global do Redux
      localStorage.setItem('authToken', authToken);

      // Redireciona o usuário para a página principal após o login
      navigate('/'); // Altere para a rota desejada
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input type="text" value={username} onChange={handleUsernameChange} />
      </label>
      <br />
      <label>
        Password:
        <input type="password" value={password} onChange={handlePasswordChange} />
      </label>
      <br />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginPage;
