import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { UserContext } from '../../../UserContext';
import DOMPurify from 'dompurify';
import './registerstyles.css';

const Register = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const { register, handleSubmit, formState: { errors }, setError } = useForm();

  // Define regex patterns
  const namePattern = /^[a-zA-Z\s]{1,50}$/;
  const usernamePattern = /^[a-zA-Z0-9]{4,30}$/;
  const accountNumberPattern = /^[0-9]{7,11}$/;
  const identificationNumberPattern = /^[0-9]{13}$/;
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  const onSubmit = async (data) => {
    // Sanitize user input using DOMPurify
    const sanitizedData = {
      firstName: DOMPurify.sanitize(data.firstName),
      lastName: DOMPurify.sanitize(data.lastName),
      username: DOMPurify.sanitize(data.username),
      accountNumber: DOMPurify.sanitize(data.accountNumber),
      password: DOMPurify.sanitize(data.password),
      identificationNumber: DOMPurify.sanitize(data.identificationNumber),
    };

    const payload = {
      ...sanitizedData,
      accountType: "Customer"
    };

    console.log(payload); // For debugging purposes

    try {
      const response = await fetch("https://localhost:3001/api/v1/users/register", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        try {
          const loginPayload = {
            username: sanitizedData.username,
            accountNumber: sanitizedData.accountNumber,
            password: sanitizedData.password,
          };

          const loginResponse = await fetch("https://localhost:3001/api/v1/users/login", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginPayload),
          });

          const loginResult = await loginResponse.json();

          if (loginResponse.ok) {
            // Set the global user state with user details
            setUser({
              token: loginResult.token,
              ...loginResult.userDetails // Add user details except password
            });
      
            // Navigate to dashboard or any page after successful login
            if (loginResult.userDetails.accountType === 'Customer') {
                alert('Registration Successful');
                navigate('/payment-info');
            }
          }
        } catch (error) {
          console.error('An error occurred:', error);
          alert('An error occurred during login. Please try again.');
        }
      } else {
        console.error('Registration error:', result.message);

        // Handle specific 400 error for existing users
        if (response.status === 400 && result.message === "User already exists") {
          setError("username", { type: "manual", message: "User already exists" });
          setError("identificationNumber", { type: "manual", message: "User already exists" });
          setError("accountNumber", { type: "manual", message: "User already exists" });
        } else {
          alert(result.message); // Display other error messages
        }
      }
    } catch (error) {
      console.error('An error occurred:', error);
      alert('An error occurred during registration. Please try again.');
    }
  };

  return (
    <div className="register-container">
      <nav className="navbar">
        <Link to="/" className="navbar-title">EasyBank</Link>
        <div className="navbar-links">
          <Link to="/login" className="nav-link">Employee Portal</Link>
          <Link to="/login" className="nav-link">Customer Portal</Link>
        </div>
      </nav>
      <div className="register-box">
        <h2 className="register-title">Register</h2>
        <p className="register-subtitle">
          Please enter valid credentials to complete the registration process for a customer.
        </p>
        <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            placeholder="First name"
            className="input-field"
            {...register("firstName", { 
              required: "First name is required", 
              pattern: { value: namePattern, message: "First name can only contain letters and spaces (max 50 characters)." } 
            })}
          />
          {errors.firstName && <span className="error-message">{errors.firstName.message}</span>}
          
          <input
            type="text"
            placeholder="Last name"
            className="input-field"
            {...register("lastName", { 
              required: "Last name is required", 
              pattern: { value: namePattern, message: "Last name can only contain letters and spaces (max 50 characters)." } 
            })}
          />
          {errors.lastName && <span className="error-message">{errors.lastName.message}</span>}
          
          <input
            type="text"
            placeholder="Username"
            className="input-field"
            {...register("username", { 
              required: "Username is required", 
              pattern: { value: usernamePattern, message: "Username must be 4-30 characters long and contain only letters and numbers." } 
            })}
          />
          {errors.username && <span className="error-message">{errors.username.message}</span>}
        
          <input
            type="text"
            placeholder="Identification Number"
            className="input-field"
            {...register("identificationNumber", { 
              required: "Identification number is required", 
              pattern: { value: identificationNumberPattern, message: "Identification number must be exactly 13 digits." } 
            })}
          />
          {errors.identificationNumber && <span className="error-message">{errors.identificationNumber.message}</span>}
        
          <input
            type="text"
            placeholder="Account Number"
            className="input-field"
            {...register("accountNumber", { 
              required: "Account number is required", 
              pattern: { value: accountNumberPattern, message: "Account number must be between 7 to 11 digits." } 
            })}
          />
          {errors.accountNumber && <span className="error-message">{errors.accountNumber.message}</span>}
        
          <input
            type="password"
            placeholder="Password"
            className="input-field"
            {...register("password", { 
              required: "Password is required", 
              pattern: { value: passwordPattern, message: "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number." } 
            })}
          />
          {errors.password && <span className="error-message">{errors.password.message}</span>}
        
          <button type="submit" className="submit-btn">Register</button>
        </form>
        <p className="login-link">
          Return to <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;