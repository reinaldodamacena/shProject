import React, { useEffect, useState } from 'react';
import ProfileSection from './ProfileSection.js';
import NavigationButtons from './NavigationButtons.js';
import CreatePostSection from './CreatePostSection';
import Feed from './Feed';
import SearchBar from './SearchBar';
import FriendList from './FriendList';
import Chat from './Chat';
import Communities from './Communities'; // Substitua por sua localização de arquivo real
import InsertionLogoIcon from '../icons/ch-logo.png';
import './Home.css';

function Home() {
  const [refreshFeed, setRefreshFeed] = useState(false);
  const [showCommunities, setShowCommunities] = useState(false);
  const [activeChat, setActiveChat] = useState(null);


  useEffect(() => {
    // Verifica se o usuário está autenticado (exemplo: verificando se há um token válido)
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      window.location.href = '/login';
    }
  }, []);

  const handlePostCreated = () => {
    setRefreshFeed(prevState => !prevState);
  };

  const toggleShowCommunities = () => {
    setShowCommunities(prevShowCommunities => !prevShowCommunities);
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
          <NavigationButtons isOnCommunityPage={showCommunities} onToggleCommunities={toggleShowCommunities} />
        </div>
        <div className="center-content">
          {showCommunities ? <Communities /> : (
            <>
              <CreatePostSection onPostCreated={handlePostCreated} />
              <Feed key={refreshFeed} /> {/* Usar o "key" para forçar a reinstanciação do componente */}
            </>
          )}
        </div>
        <div className="right-sidebar">
          <SearchBar />
          <FriendList setActiveChat={setActiveChat} />
          {activeChat && <Chat activeChat={activeChat} />}
        </div>
      </div>
    </div>
  );
}

export default Home;
