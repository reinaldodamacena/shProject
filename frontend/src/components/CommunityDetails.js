import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCommunityDetails, getCommunityPosts } from '../Api';
import Post from './Post';
import CreateCommunityPostSection from './CreateCommunityPostSection';
import ProfileSection from './ProfileSection';
import MemberList from './MemberList';
import './CommunityDetails.css';
import InsertionLogoIcon from '../icons/ch-logo.png';

const CommunityDetails = () => {
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const fetchCommunityAndPosts = async () => {
      try {
        const communityData = await getCommunityDetails(id);
        setCommunity(communityData);
        const postsData = await getCommunityPosts(id);
        setPosts(postsData);
      } catch (error) {
        console.error('Erro ao obter detalhes da comunidade e posts:', error);
      }
    };

    fetchCommunityAndPosts();
  }, [id]);

  const handlePostCreated = async () => {
    try {
      const postsData = await getCommunityPosts(id);
      setPosts(postsData);
    } catch (error) {
      console.error('Erro ao obter posts da comunidade:', error);
    }
  };

  if (!community) {
    return <p>Carregando detalhes da comunidade...</p>;
  }

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
          <ProfileSection /> {/* Adicione o componente ProfileSection aqui */}
        </div>
        <div className="center-content">
          <div className="community-details">
            <h1>{community.name}</h1>
            <p>{community.description}</p>
          </div>
          <div className="create-postCommunitie-section">
            <CreateCommunityPostSection id={id} onPostCreated={handlePostCreated} />
          </div>
          <div className="postsCommunitie-section">
            <h2>Posts</h2>
            {posts.map((post) => (
              <Post
                key={post.id}
                user={post.user}
                profile={post.profile}
                content={post.content}
                image={post.image}
                timestamp={post.timestamp}
                likes={post.likes}
                comments={post.comments}
                postId={post.id}
              />
            ))}
          </div>
        </div>
        <div className="right-sidebar">
          <div className="community">
            <h1>Criador: {community.creator}</h1> {/* Certifique-se de que a comunidade tem um campo 'creator' */}
            <MemberList members={community.members} /> {/* Certifique-se de que a comunidade tem um campo 'members' */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityDetails;
