import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MyCalendar from './Calendar';
import { useNavigate } from 'react-router-dom';
import './styles/Home.css';
import { capitalizeFirstLetter } from '../utils/capitalize';

const Home = ({ user }) => {
  const [firstName, setFirstName] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://18.235.3.139:8080/api/auth/user', { // Change localhost to 18.235.3.139 when deploying using ec2
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
      await axios.post('http://18.235.3.139:8080/api/auth/logout', {}, { // Change localhost to 18.235.3.139 when deploying using ec2
        withCredentials: true
      });
      navigate('/');
    } catch (error) {
      console.error('There was an error logging out!', error);
    }
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  };

  const goToCurrentMonth = () => {
    setCurrentDate(new Date());
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  };

  return (
    <div className="home-container">
      <div className="header">
        <div className="app-title">
          <span>AgendaAlly</span>
          <img src="/icons/notebook.png" alt="Cute Notebook" className="header-icon" />
        </div>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
      <div className="welcome-message">
        Welcome,  {firstName} <img src="/icons/sunny.png" alt="Sun Icon" className="welcome-icon" />
      </div>
      <div className="calendar-nav-buttons">
        <button onClick={goToPreviousMonth} className="nav-button">Previous Month</button>
        <button onClick={goToCurrentMonth} className="nav-button current-month-button">Current Month</button>
        <button onClick={goToNextMonth} className="nav-button">Next Month</button>
      </div>
      <div className="calendar-container">
        <MyCalendar currentDate={currentDate} />
      </div>
    </div>
  );
};

export default Home;
