import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './components/Home';
import LoginPage from './components/LoginPage';
import CadastroForm from './components/FormularioCadastro'
import Chat from './components/Chat';
import { CHAT_ROUTE } from './apiRoutes';



function App() {
  const location = useLocation();
  const roomName = location?.state?.name || null;
  
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path='/cadastro' element={<CadastroForm/>}/>
        <Route path={`${CHAT_ROUTE}:roomName`} element={<Chat />} />

      </Routes>
    </div>
  );
}

export default App;