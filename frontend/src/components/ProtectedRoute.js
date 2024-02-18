import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { currentUser } = useAuth();

  return currentUser ? <Component {...rest} /> : <Navigate to="/main" />;
};

export default ProtectedRoute;