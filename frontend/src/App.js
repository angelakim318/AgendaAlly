import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Landing from './components/Landing';
import Calendar from './components/Calendar';
import JournalEntry from './components/JournalEntry'; 

const App = () => {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home user={user} />} />
        <Route path="/calendar" element={<Calendar />} />  
        <Route path="/journal/:date" element={<JournalEntry />} /> 
      </Routes>
    </Router>
  );
};

export default App;
