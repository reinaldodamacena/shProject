import React, { useState } from 'react';
import './FormularioCadastro.css'

function CadastroForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você pode fazer algo com as informações do formulário, como enviar para um servidor.
    console.log(`firstName: ${firstName}, LastName: ${lastName}, E-mail: ${email}, Senha: ${senha}`);
  };

  return (<div className='formulario'>
      <h1 className='formularioText'>Formulário</h1>
      <h2 className='textLogo'>ConnectHeroes</h2>
      <form className="register" onSubmit={handleSubmit}>
      <label>
       First name: 
        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
      </label>
      <label>
        Last name: 
        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
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
  </div>
    
  );
}

export default CadastroForm;