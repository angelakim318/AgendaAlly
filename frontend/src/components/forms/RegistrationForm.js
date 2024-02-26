import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegistrationForm() {
  const [userDetails, setUserDetails] = useState({
    firstName: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState(""); // For storing registration error message
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails(prevDetails => ({
      ...prevDetails,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (userDetails.password !== userDetails.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const { confirmPassword, ...userData } = userDetails; // Exclude confirmPassword from userData sent to server

    const url = 'http://localhost:8080/api/users/register';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Assuming the server sends back a JSON with error details
        throw new Error(errorData.message || "Registration failed");
      }

      navigate('/main'); // Redirect to main page after successful registration
    } catch (error) {
      setError(error.message); // Update state to show error message
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
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
      <input 
        type="password" 
        placeholder="Confirm Password" 
        name="confirmPassword"
        value={userDetails.confirmPassword} 
        onChange={handleChange} 
        required 
      />
      <button type="submit">Register</button>
    </form>
  );
}

export default RegistrationForm;
