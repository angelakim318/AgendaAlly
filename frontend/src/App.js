import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Landing from './components/Landing';
import Calendar from './components/Calendar';
import JournalEntry from './components/JournalEntry';
import axios from 'axios';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/auth/user', { withCredentials: true });
        setUser(response.data);
      } catch (error) {
        console.error('No active session found', error);
      }
    };
    checkUserSession();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={user ? <Home user={user} /> : <Navigate to="/login" />} />
        <Route path="/calendar" element={user ? <Calendar user={user} /> : <Navigate to="/login" />} />
        <Route path="/journal/:date" element={user ? <JournalEntry user={user} /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
