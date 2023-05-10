import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Post = ({ user, content, image, timestamp, likes, postId }) => {
  const [postLikes, setPostLikes] = useState([]);
  const [liked, setLiked] = useState(false);
  useEffect(() => {
    const fetchPostLikes = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        const endpoint = `http://localhost:8000/posts/${postId}/check_like/`;

        const response = await axios.get(endpoint, {
          headers: {
            'Authorization': `Token ${authToken}`,
          },
        });

        if (response.status === 200 && response.data && response.data.liked) {
          setLiked(true);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchPostLikes();
  }, [postId]);

  const handleLike = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      const endpoint = `http://localhost:8000/posts/${postId}/like/`;

      const response = await axios.post(endpoint, null, {
        headers: {
          'Authorization': `Token ${authToken}`,
        },
      });

      if (response.status === 200) {
        const newLike = { id: user.id };
        if (!liked) {
          setPostLikes([...postLikes, newLike]);
        } else {
          const updatedLikes = postLikes.filter(like => like.id !== user.id);
          setPostLikes(updatedLikes);
        }
        setLiked(!liked);
      } else {
        console.log('Erro ao adicionar/remover o like');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="post">
      {/* Foto do usuário */}
      <img src={user.avatar} alt="Avatar" />

      {/* Nome do usuário */}
      <div>{user.username}</div>

      {/* Data da publicação */}
      <div>{timestamp}</div>

      {/* Espaço para caixa de texto */}
      <p>{content}</p>

      {/* Imagem (se o usuário tiver criado uma) */}
      {image && <img src={image} alt="Post Image" />}

      {/* Opções "curtir", "comentar" e "compartilhar" */}
      <div>
        <button onClick={handleLike}>{liked ? 'Descurtir' : 'Curtir'} {}</button>
        <button>Comentar</button>
        <button>Compartilhar</button>
      </div>
    </div>
  );
};

export default Post;