import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const payload = new URLSearchParams();
      payload.append('username', username);
      payload.append('password', password);

      await axios.post('http://localhost:8080/login', payload, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        withCredentials: true
      });

      const userResponse = await axios.get('http://localhost:8080/api/auth/user', {
        withCredentials: true
      });

      setUser(userResponse.data);
      navigate('/home');
    } catch (error) {
      alert('Login failed!');
      console.error('There was an error logging in!', error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
