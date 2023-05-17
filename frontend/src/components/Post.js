import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Avatar from '@mui/material/Avatar';
import InsertionLikeIcon from '../icons/like.svg';
import InsertionUnlikeIcon from '../icons/unlike.svg';
import InsertionCommentIcon from '../icons/comment.svg';
import InsertionSendIcon from '../icons/send.svg';
import './Post.css'


const Post = ({ user, profile, content, file, timestamp, likes, postId }) => {
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
      <div className="head-post">
        {console.log(profile.user)}
        <Avatar alt={profile.user.username} src={profile.avatar} sx={{ width: 56, height: 56 }}/>
        <div className="post-info">
        <h3 className="post-author">{profile.user.first_name}</h3>
        <p className="post-data">{new Date(timestamp).toLocaleDateString('pt-BR', {
        day: 'numeric', 
        month: 'long', 
        year: 'numeric'
        })}</p></div>
      </div>
      <p className="post-content">{content}</p>

      {file && (
        <div className="post-media">
          {file.endsWith('.mp4') ? (
            <video className="post-video" controls controlsList="nodownload">
              <source src={file} type="video/mp4" />
              Seu navegador não suporta reprodução de vídeo.
            </video>
          ) : (
            <img className="post-img" src={file} alt="Post Image" />
          )}
        </div>
      )}

      {/* Opções "curtir", "comentar" e "compartilhar" */}
      <div className="b-opitions">
        <div className="b-like" onClick={handleLike}>{liked ? <img src={InsertionLikeIcon} alt="Descurtir"/> : <img src={InsertionUnlikeIcon} alt="Curtir"/>} {}</div>
        <div className="b-comment"><img src={InsertionCommentIcon} alt="Comentar"/></div>
        <div className="b-send"><img src={InsertionSendIcon} alt="Compartilhar"/></div>
      </div>
    </div>
  );
};

export default Post;