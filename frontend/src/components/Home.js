import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import Header from './Header';
import ProfileSection from './ProfileSection.js';
import NavigationButtons from './NavigationButtons.js';
import CreatePostSection from './CreatePostSection';
import Feed from './Feed';
import SearchBar from './SearchBar';
import FriendList from './FriendList';
import Chat from './Chat';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    // Verifica se o usuário está autenticado (exemplo: verificando se há um token válido)
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="app-container">
      <Header />
      <div className="main-content">
        <div className="left-sidebar">
          <ProfileSection />
          <NavigationButtons />
        </div>
        <div className="center-content">
          <CreatePostSection />
          <Feed />
        </div>
        <div className="right-sidebar">
          <SearchBar />
          <FriendList />
          <Chat />
        </div>
      </div>
    </div>
  );
}

export default Home;
