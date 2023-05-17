import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './components/Home';
import LoginPage from './components/LoginPage';
import Communities from './components/Communities';
import CommunityDetails from './components/CommunityDetails';
import SearchResults from './components/SearchResults';
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

        <Route path="/comunidade" element={<Communities />} />
        <Route path="/comunidade/:id" element={<CommunityDetails />} />
        <Route path="/search" element={<SearchResults />} />
      </Routes>
    </div>
  );
}

export default App;