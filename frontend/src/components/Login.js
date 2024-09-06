import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './styles/Login.css';

const Login = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const payload = new URLSearchParams();
      payload.append('username', username);
      payload.append('password', password);

      await axios.post('http://18.235.3.139:8080/login', payload, { // Change localhost to 18.235.3.139 when deploying using ec2
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        withCredentials: true
      });

      const userResponse = await axios.get('http://18.235.3.139:8080/api/auth/user', { // Change localhost to 18.235.3.139 when deploying using ec2
        withCredentials: true
      });

      setUser(userResponse.data);
      navigate('/home');
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setError('Invalid username or password.');
        } else if (error.response.status === 404) {
          setError('Username not found.');
        } else {
          setError('Login failed. Please try again.');
        }
      } else {
        setError('Login failed. Please try again.');
      }
      console.error('There was an error logging in!', error);
    }
  };

  return (
    <div className="login-page">
      <div className="header">
        <div className="title">
          <span>AgendaAlly</span>
          <img src="/icons/notebook.png" alt="Cute Notebook" className="header-icon" />
        </div>
      </div>
      <div className="login-container">
        <h2>Login</h2>
        {error && (
          <div className="custom-alert">
            <p>{error}</p>
          </div>
        )}
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button onClick={handleLogin}>Login</button>
        <div className="register-link">
          <p>Don't have an account? <Link to="/register">Register here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
