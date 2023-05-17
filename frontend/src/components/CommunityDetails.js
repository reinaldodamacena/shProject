import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCommunityDetails, getCommunityPosts } from '../Api';
import Post from './Post';
import CreateCommunityPostSection from './CreateCommunityPostSection';

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
    <div>
      <h1>{community.name}</h1>
      <p>{community.description}</p>

      <CreateCommunityPostSection id={id} onPostCreated={handlePostCreated} />

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
  );
};

export default CommunityDetails;
