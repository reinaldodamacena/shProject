import React, { useState } from 'react';
import { createPost } from '../Api';

const CreatePostSection = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('content', content);

    if (image) {
      formData.append('image', image);
    }

    try {
      await createPost(formData);
      console.log('Publicação criada com sucesso!');
      setContent('');
      setImage(null);
      onPostCreated(); // Chamar a função para notificar que a publicação foi criada
    } catch (error) {
      console.error('Erro ao criar a publicação:', error);
    }
  };

  return (
    <section className="create-post-section">
      <form onSubmit={handleFormSubmit}>
        {/* Caixa de texto */}
        <textarea
          placeholder="Digite sua publicação"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        {/* Opção para inserir mídia */}
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        {/* Botão de publicar */}
        <button type="submit">Publicar</button>
      </form>
    </section>
  );
};

export default CreatePostSection;