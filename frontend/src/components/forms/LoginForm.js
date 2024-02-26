import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState(""); // For storing login error message
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
        body: JSON.stringify(credentials),
        credentials: 'include', // Necessary for cookies to be sent and received
      });

      if (!response.ok) {
        const errorData = await response.json(); 
        throw new Error(errorData.message || "Login failed");
      }

      navigate('/main'); // Redirect to main page after successful login
    } catch (error) {
      setError(error.message); // Update state to show error message
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
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
