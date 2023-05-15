import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import LoginPage from './components/LoginPage';
import SignIn from './components/SigIn';
import Communities from './components/Communities';


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/comunidade" element={<Communities />} />
      </Routes>
    </div>
  );
}

export default App;