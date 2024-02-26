import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prevCredentials => ({
      ...prevCredentials,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = 'http://localhost:8080/login';

    try {
      const response = await fetch(url, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password,
        }),
        credentials: 'include', // cookies if server uses
      });

      if (!response.ok) {
        throw new Error(`Login failed: ${response.status}`);
      }

      const data = await response.json(); 
      console.log('Login successful:', data);

      // Redirect to main page after successful login
      navigate('/main'); 
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        placeholder="Username" 
        name="username" 
        value={credentials.username} 
        onChange={handleChange} 
        required 
      />
      <input 
        type="password" 
        placeholder="Password" 
        name="password" 
        value={credentials.password} 
        onChange={handleChange} 
        required 
      />
      <button type="submit">Login</button>
    </form>
  );
}

export default LoginForm;
