import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import LoginPage from './components/LoginPage';
import Communities from './components/Communities';
import CommunityDetails from './components/CommunityDetails';
import SearchResults from './components/SearchResults';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/comunidade" element={<Communities />} />
        <Route path="/comunidade/:id" element={<CommunityDetails />} />
        <Route path="/search" element={<SearchResults />} />
      </Routes>
    </div>
  );
}

export default App;