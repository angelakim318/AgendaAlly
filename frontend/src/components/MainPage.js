import React from 'react';
import { useAuth } from '../context/AuthContext';

const MainPage = () => {
  const { currentUser } = useAuth(); // access current user's information

  return <h1>Hello, {currentUser.firstName}</h1>;
};

export default MainPage;