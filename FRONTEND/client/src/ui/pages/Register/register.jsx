import React from 'react';
import './RegisterStyles.css';
import backgroundImage from './ui/images/background.png'; // Adjust according to your directory

const Register = () => {
  return (
    <div className="register-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="register-box">
        <h2 className="register-title">Register</h2>
        <p className="register-subtitle">
          Please enter valid credentials to begin the first phase of the registration process.
        </p>
        <form className="register-form">
          <div className="form-group">
            <input type="text" placeholder="First name" className="input-field" required />
            <input type="text" placeholder="Last name" className="input-field" required />
          </div>
          <input type="text" placeholder="Username" className="input-field" required />
          <input type="text" placeholder="Identification Number" className="input-field" required />
          <input type="text" placeholder="Account Number" className="input-field" required />
          <input type="password" placeholder="Password" className="input-field" required />
          <button type="submit" className="submit-btn">Proceed →</button>
        </form>
        <p className="login-link">
          Return to <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
