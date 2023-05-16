import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import LoginPage from './components/LoginPage';
import CadastroForm from './components/FormularioCadastro'



function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path='/cadastro' element={<CadastroForm/>}/>
      </Routes>
    </div>
  );
}

export default App;