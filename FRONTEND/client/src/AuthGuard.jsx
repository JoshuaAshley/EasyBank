import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from './UserContext';

const AuthGuard = ({ children }) => {
  const { user } = useContext(UserContext); // Access the current user

  if (!user) {
    // If no user is logged in, redirect to the login page
    return <Navigate to="/login" />;
  }

  // If a user is logged in, render the children components (protected content)
  return children;
};

export default AuthGuard;