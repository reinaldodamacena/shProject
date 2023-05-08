import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProfileForm from './components/ProfileForm';
import ProfileView from './components/ProfileView';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<ProfileForm />} />
        <Route path="/:id" element={<ProfileView />} />
      </Routes>
    </div>
  );
}

export default App;
