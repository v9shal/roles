import { useState } from 'react';
import Home from './pages/Home';
import { Route, Routes } from 'react-router-dom';
import Contribute from './pages/contribute';
import Searched from './pages/Searched';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<div>Login</div>} />
        <Route path="/register" element={<div>Register</div>} />
        <Route path="/contribute" element={<Contribute />} />
        <Route path="/search/:type/:query" element={<Searched />} />
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </>
  );
}

export default App;
