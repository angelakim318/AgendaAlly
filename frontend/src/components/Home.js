import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MyCalendar from './Calendar';
import { useNavigate } from 'react-router-dom';

const Home = ({ user }) => {
  const [firstName, setFirstName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/auth/user', {
          withCredentials: true
        });
        setFirstName(response.data.firstName);
      } catch (error) {
        console.error('There was an error fetching the user!', error);
      }
    };

    if (user) {
      setFirstName(user.firstName);
    } else {
      fetchUser();
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8080/api/auth/logout', {}, {
        withCredentials: true
      });
      navigate('/');
    } catch (error) {
      console.error('There was an error logging out!', error);
    }
  };

  return (
    <div>
      <h1>Welcome, {firstName}!</h1>
      <button onClick={handleLogout}>Logout</button>
      <MyCalendar />
    </div>
  );
};

export default Home;
