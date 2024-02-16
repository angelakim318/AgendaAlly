import React, { useState } from 'react';

function LoginForm() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prevCredentials => ({
      ...prevCredentials,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(credentials);
    // Here you would send credentials to your backend API for authentication
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
