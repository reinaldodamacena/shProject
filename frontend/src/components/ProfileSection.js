import React, { useEffect, useState } from 'react';
import { getFeedData } from '../Api'; // importando a função que busca os dados do perfil

const ProfileSection = () => {
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        const data = await getFeedData(authToken); // usando a função para buscar os dados do perfil
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
      <div>Nome de usuário: {user.username}</div>
      {/* Número de conexões */}
      <div>Número de conexões: {connections.length}</div>
      {/* Opção para ir até as publicações */}
      <button>Ir até as publicações</button>
      {/* Opção para ir até os vídeos */}
      <button>Ir até os vídeos</button>
    </section>
  );
};

export default ProfileSection;
