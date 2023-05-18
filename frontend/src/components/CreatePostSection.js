import React, { useState } from 'react';
import { createPost } from '../Api';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InsertionMediaIcon from '../icons/media.svg';
import InsertionLocalizationIcon from '../icons/localization.svg';
import './CreatePostSection.css';

const CreatePostSection = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('content', content);

    if (file) {
      formData.append('file', file);
    }

    try {
      await createPost(formData);
      console.log('Publicação criada com sucesso!');
      setContent('');
      setFile(null);
      onPostCreated(); // Chamar a função para notificar que a publicação foi criada
    } catch (error) {
      console.error('Erro ao criar a publicação:', error);
    }
  };

  const handleIconClick = () => {
    document.getElementById('file-input').click();
  };

  return (
    <section className="create-post-section">
      <form onSubmit={handleFormSubmit}>
        {/* Caixa de texto */}
        <TextField
          multiline
          rows={4}
          variant="outlined"
          placeholder="Digite sua publicação"
          fullWidth
          InputProps={{
            readOnly: false,
          }}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        {/* Opção para inserir mídia */}
        <div className="options">
          <div className="file-input-container">
            <img src={InsertionMediaIcon} alt="Inserção de Mídia" className="insertion-icon" onClick={handleIconClick} />
            <input type="file" id="file-input" className="file-input" onChange={(e) => setFile(e.target.files[0])} />
          </div>
          <img src={InsertionLocalizationIcon} alt="Inserção de Localização" className="insertion-icon" onClick={() => console.log('foi')} />
          {/* Botão de publicar */}
          <Button variant="contained" type="submit" sx={{ backgroundColor: '#5C95E3' }}>
            Publicar
          </Button>
        </div>
      </form>
    </section>
  );
};

export default CreatePostSection;
