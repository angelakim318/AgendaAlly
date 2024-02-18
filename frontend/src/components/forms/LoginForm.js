import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const navigate = useNavigate(); // initialize useNavigate hook

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prevCredentials => ({
      ...prevCredentials,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(credentials);
    // Endpoint for authentication
  const loginUrl = 'http://localhost:8080/api/users/login';

    try {
      // Make a POST request to the login endpoint with credentials
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      // Check if the login was successful
      if (!response.ok) {
        throw new Error(`Login failed: ${response.status}`);
      }

      const userData = await response.json();
      console.log('Login successful:', userData);
      navigate('/main'); // redirect user to MainPage
    } catch (error) {
      console.error('Login error:', error);
      // Handle login errors 
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
