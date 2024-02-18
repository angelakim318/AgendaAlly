import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import RegistrationForm from './components/forms/RegistrationForm';
import LoginForm from './components/forms/LoginForm';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainPage from './components/MainPage';


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <h1>AgendaAlly</h1>
          <Routes>
            <Route path="/register" element={<RegistrationForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/main" element={<ProtectedRoute><MainPage /></ProtectedRoute>} />
            <Route path="/" element={<div>Welcome to AgendaAlly! <Link to="/register">Register</Link> | <Link to="/login">Login</Link></div>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
