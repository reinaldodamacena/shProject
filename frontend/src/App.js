import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import LoginPage from './components/LoginPage';
import SignIn from './components/SigIn';
import Chat from './components/Chat';


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/chat/:roomName" component={Chat} />
      </Routes>
    </div>
  );
}

export default App;