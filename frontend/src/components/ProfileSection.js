import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { getProfileData } from '../Api';
import './ProfileSection.css'

const ProfileSection = () => {
  const [profileData, setProfileData] = useState({});

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        console.log('authToken:', authToken);
        const data = await getProfileData(authToken);
        console.log('profileData:', data);
        setProfileData(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfileData();
  }, []);

  if (!profileData) {
    return <div>Carregando...</div>;
  }

  const { background_image, avatar, user, bio, connections } = profileData;

  return (
    <section className="profile-section">
      {/* Imagem de fundo */}
      <div className="content-profile">
        <img src={background_image} alt="Imagem de fundo" className="bg-profile"/>
        {/* Imagem de perfil */}
        <img src={avatar} alt="Imagem de perfil" className="img-profile" />
      </div>
      {/* Nome de usuário */}
      <div className='personal-profile-info'>
        <h3>{user?.username}</h3> 
        <p>{bio}</p> 
      </div>
      {/* Número de conexões */}
      <div className='connections'>
        <h4>{connections ? connections.length: 0}</h4>
        <p>Conexões</p>
      </div>

      <div className='profile-buttons'>
        <Button variant="outlined">Publicações</Button>
        <Button variant="outlined">Vídeos</Button>
      </div>
    </section>
  );
};

export default ProfileSection;