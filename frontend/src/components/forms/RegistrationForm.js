import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegistrationForm() {
  const [userDetails, setUserDetails] = useState({
    firstName: '',
    username: '',
    password: ''
  });
  const navigate = useNavigate(); // initialize useNavigate hook

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails(prevDetails => ({
      ...prevDetails,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(userDetails);
    const url = 'http://localhost:8080/api/users/register';

    try {
      const response = await fetch(url, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDetails),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();
      console.log('Success:', result);
      navigate('/main'); // redirect user to MainPage
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        placeholder="First Name"
        name="firstName"
        value={userDetails.firstName} 
        onChange={handleChange} 
        required 
      />
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
      <button type="submit">Register</button>
    </form>
  );
}

export default RegistrationForm;
