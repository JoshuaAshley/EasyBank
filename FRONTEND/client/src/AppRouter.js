import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './ui/pages/Landing/landing';
import Register from './ui/pages/Register/register';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;