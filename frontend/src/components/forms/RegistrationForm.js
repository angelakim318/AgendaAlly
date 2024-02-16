import React, { useState } from 'react';

function RegistrationForm() {
  const [userDetails, setUserDetails] = useState({
    username: '',
    password: '',
    email: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails(prevDetails => ({
      ...prevDetails,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(userDetails);
    // Here you would send userDetails to your backend API
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        placeholder="Username" 
        name="username" 
        value={userDetails.username} 
        onChange={handleChange} 
        required 
      />
      <input 
        type="password" 
        placeholder="Password" 
        name="password" 
        value={userDetails.password} 
        onChange={handleChange} 
        required 
      />
      <input 
        type="email" 
        placeholder="Email" 
        name="email" 
        value={userDetails.email} 
        onChange={handleChange} 
        required 
      />
      <button type="submit">Register</button>
    </form>
  );
}

export default RegistrationForm;
