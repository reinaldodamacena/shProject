import React, { useEffect, useState } from 'react';
import { getProfileData } from '../Api';

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

  const { background_image, avatar, user, connections } = profileData;

  return (
    <section className="profile-section">
      {/* Imagem de fundo */}
      <img src={background_image} alt="Imagem de fundo" className="bg-profile"/>
      {/* Imagem de perfil */}
      <img src={avatar} alt="Imagem de perfil" className="img-profile" />
      {/* Nome de usuário */}
      <div>Nome de usuário: {user?.username}</div> 
      {/* Número de conexões */}
      <div>Número de conexões: {connections ? connections.length: 0}</div>
      {/* Opção para ir até as publicações */}
      <button>Ir até as publicações</button>
      {/* Opção para ir até os vídeos */}
      <button>Ir até os vídeos</button>
    </section>
  );
};

export default ProfileSection;
