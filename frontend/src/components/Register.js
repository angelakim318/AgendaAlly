import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './styles/Register.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState(''); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://18.235.3.139:8080/api/auth/register', { // Change localhost to 18.235.3.139 when deploying using ec2
        firstName,
        lastName,
        username,
        password
      });
      console.log('User registered successfully', response.data);
      navigate('/login'); 
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setError('Username already exists.');
      } else {
        setError('Registration failed. Please try again.');
      }
      console.error('There was an error registering the user!', error);
    }
  };

  return (
    <div className="register-page">
      <div className="header">
        <div className="title">
          <span>AgendaAlly</span>
          <img src="/icons/notebook.png" alt="Cute Notebook" className="header-icon" />
        </div>
      </div>
      <div className="register-container">
        <h2>Register</h2>
        {error && (
          <div className="custom-alert">
            <p>{error}</p>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div>
            <label>First Name</label>
            <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>
          <div>
            <label>Last Name</label>
            <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
          <div>
            <label>Username</label>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div>
            <label>Password</label>
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit">Register</button>
        </form>
        <div className="login-link">
          <p>Already have an account? <Link to="/login">Login here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
