import React from 'react';
import { Link } from 'react-router-dom';
import './landingStyle.css';

const LandingPage = () => {
  return (
    <div className="landing-container">
      <nav className="navbar">
        <Link to="/" className="navbar-title">EasyBank</Link>
        <div className="navbar-links">
          <Link to="/employee-portal" className="nav-link">Employee Portal</Link>
          <Link to="/customer-portal" className="nav-link">Customer Portal</Link>
        </div>
      </nav>
      
      <div className="landing-content">
        <div className="left-section">
          <h1 className="landing-heading">
            <span className="easy-text">Easy</span><span className="bank-text">Bank</span>
          </h1>
          <h2 className="landing-subheading">The future of banking is here</h2>
          <p className="landing-description">
            Banking experience has never been this easy before. Start your journey now and see the difference.
          </p>
          <div className="landing-buttons">
            <Link to="/register" className="sign-up-btn">Sign Up</Link>
            <button className="watch-demo-btn">Watch Demo</button>
          </div>
        </div>

        <div className="right-section">
          <img src='/images/piggybank.png' alt="Landing" className="landing-image" />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;