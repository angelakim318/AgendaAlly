import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import JournalEntry from './components/JournalEntry';
import Schedule from './components/Schedule';
import Login from './components/Login';
import Register from './components/Register';
import Landing from './components/Landing';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home user={user} />} />
        <Route path="/journal/:date" element={<JournalEntry user={user} />} />
        <Route path="/schedule/:date" element={<Schedule user={user} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
