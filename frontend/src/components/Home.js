// No componente Home
import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import ProfileSection from './ProfileSection.js';
import NavigationButtons from './NavigationButtons.js';
import CreatePostSection from './CreatePostSection';
import Feed from './Feed';
import SearchBar from './SearchBar';
import FriendList from './FriendList';
import Chat from './Chat';
import { useNavigate } from 'react-router-dom';
import InsertionLogoIcon from '../icons/ch-logo.png';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const [refreshFeed, setRefreshFeed] = useState(false);

  useEffect(() => {
    // Verifica se o usuário está autenticado (exemplo: verificando se há um token válido)
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      navigate('/login');
    }
  }, [navigate]);

  const handlePostCreated = () => {
    setRefreshFeed(prevState => !prevState);
  };

  return (
    <div className="app-container">
      <div className="main-content">
        <div className="left-sidebar">
          <div className='global-logo'>
            <img src={InsertionLogoIcon} alt="Connect Heroes"/>
            <div className='logo-name'>
              <h1>Connect Heroes</h1>
            </div>
          </div>
          <ProfileSection />
          <NavigationButtons />
        </div>
        <div className="center-content">
          <CreatePostSection onPostCreated={handlePostCreated} />
          <Feed key={refreshFeed} /> {/* Usar o "key" para forçar a reinstanciação do componente */}
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
