import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MyCalendar from './Calendar';

const Home = ({ user }) => {
  const [firstName, setFirstName] = useState('');

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

  return (
    <div>
      <h1>Welcome, {firstName}!</h1>
      <MyCalendar />
    </div>
  );
};

export default Home;
