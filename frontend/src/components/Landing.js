import React from 'react';
import { Link } from 'react-router-dom';
import './styles/Landing.css';

const Landing = () => {
  return (
    <div className="landing-container">
      <div className="landing-title">
        <span>AgendaAlly</span>
        <img src="/icons/notebook.png" alt="Cute Notebook" className="landing-icon" />
      </div>
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
