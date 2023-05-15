import React, { useState } from 'react';
import axios from 'axios';

const NewPostForm = ({ communityId }) => {
  const [content, setContent] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const authToken = localStorage.getItem('authToken');
    const endpoint = `http://localhost:3000/comunidade/${communityId}/posts/`;

    try {
      await axios.post(
        endpoint,
        { content }, // substitua por seu payload de postagem
        {
          headers: {
            'Authorization': `Token ${authToken}`,
          },
        }
      );
      setContent('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <button type="submit">Postar</button>
    </form>
  );
};

export default NewPostForm;
