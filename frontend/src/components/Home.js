import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MyCalendar from './Calendar';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import { capitalizeFirstLetter } from '../utils/capitalize';

const Home = ({ user }) => {
  const [firstName, setFirstName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/auth/user', {
          withCredentials: true
        });
        setFirstName(capitalizeFirstLetter(response.data.firstName));
      } catch (error) {
        console.error('There was an error fetching the user!', error);
      }
    };

    if (user) {
      setFirstName(capitalizeFirstLetter(user.firstName));
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
    <div className="home-container">
      <div className="header">
        <div className="title">AgendaAlly</div>
        <div className="welcome-message">Welcome, {firstName}!</div>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
      <div className="calendar-container">
        <MyCalendar />
      </div>
    </div>
  );
};

export default Home;
