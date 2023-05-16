import React, { useState } from 'react';
import './FormularioCadastro.css'

function CadastroForm() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você pode fazer algo com as informações do formulário, como enviar para um servidor.
    console.log(`Nome: ${nome}, E-mail: ${email}, Senha: ${senha}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Nome:
        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />
      </label>
      <label>
        E-mail:
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label>
        Senha:
        <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />
      </label>
      <button type="submit">Cadastrar</button>
    </form>
  );
}

export default CadastroForm;