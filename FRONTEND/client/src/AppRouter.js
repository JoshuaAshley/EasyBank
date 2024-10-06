import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './UserContext';
import LandingPage from './ui/pages/Landing/landing';
import Register from './ui/pages/Register/register';
import Login from './ui/pages/Login/login';
import PaymentInfo from './ui/pages/PaymentInfo/paymentinfo';
import AuthGuard from './AuthGuard'; // Import the AuthGuard
import AccountInfo from './ui/pages/AccountInfo/accountinfo';
import { FormDataProvider } from './FormDataContext'; 

function App() {
  return (
    <UserProvider>
      <Router>
        <FormDataProvider>
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
            <Route 
              path="/account-info"
              element={
                <AuthGuard>
                  <AccountInfo />
                </AuthGuard>
              } 
            />
          </Routes>
        </FormDataProvider>
      </Router>
    </UserProvider>
  );
}

export default App;