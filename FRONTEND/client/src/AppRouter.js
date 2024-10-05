import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './UserContext';
import LandingPage from './ui/pages/Landing/landing';
import Register from './ui/pages/Register/register';
import Login from './ui/pages/Login/login';
import PaymentInfo from './ui/pages/PaymentInfo/paymentinfo';
import AuthGuard from './AuthGuard'; // Import the AuthGuard

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protect the PaymentInfo route */}
          <Route 
            path="/payment-info"
            element={
              <AuthGuard>
                <PaymentInfo />
              </AuthGuard>
            } 
          />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;