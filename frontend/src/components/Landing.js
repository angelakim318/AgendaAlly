import React from 'react';
import { Link } from 'react-router-dom';
import './styles/Landing.css';

const Landing = () => {
  return (
    <div className="landing-container">
      <div className="landing-title">
        <img src="/icons/notebook.png" alt="Cute Notebook" className="landing-icon" />
        <span>AgendaAlly</span>
      </div>
      <p className="landing-description">
        Welcome to AgendaAlly! Seamlessly organize your tasks and capture your thoughts. Whether you're planning or reflecting, AgendaAlly keeps everything in one place, easily accessible, and secure. Start your journey to better organization and personal reflection today.
      </p>
      <p className="landing-note">
        P.S. Don't forget to register an account and log in to unlock the full potential of AgendaAlly.
      </p>
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
