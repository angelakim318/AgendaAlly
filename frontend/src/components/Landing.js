import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  return (
    <div className="landing-container">
      <h1 className="landing-title">AgendaAlly</h1>
      <div className="landing-buttons">
        <Link to="/login">
          <button className="landing-button">Login</button>
        </Link>
        <Link to="/register">
          <button className="landing-button">Register</button>
        </Link>
      </div>
    </div>
  );
};

export default Landing;
