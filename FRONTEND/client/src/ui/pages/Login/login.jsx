import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { UserContext } from '../../../UserContext';
import './loginstyles.css';

const Login = () => {
  const { register, handleSubmit, formState: { errors }, setError } = useForm();
  const { setUser } = useContext(UserContext); // Access setUser from context
  const navigate = useNavigate(); // To redirect user after login

  // Define regex patterns
  const usernamePattern = /^[a-zA-Z0-9]{4,30}$/;
  const accountNumberPattern = /^[0-9]{7,11}$/;
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  const onSubmit = async (data) => {
    const payload = {
      username: data.username,
      accountNumber: data.accountNumber,
      password: data.password,
    };
  
    try {
      const response = await fetch("https://localhost:3001/api/v1/users/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        // Set the global user state with user details
        setUser({
          token: result.token,
          ...result.userDetails // Add user details except password
        });
  
        // Navigate to dashboard or any page after successful login
        if (result.userDetails.accountType === 'Customer') {
            alert('Login Successful');
            navigate('/home');
        } else {
            alert('Login Successful');
            navigate('/employee-dashboard');
        }
      } else {
        // Handle 401 Unauthorized error
        if (response.status === 401) {
          setError("password", { type: "manual", message: "Invalid credentials. Please check your username, password, or account number." });
          setError("accountNumber", { type: "manual", message: "Invalid credentials. Please check your username, password, or account number." });
          setError("username", { type: "manual", message: "Invalid credentials. Please check your username, password, or account number." });
        } else {
          alert(result.message); // Display any other server error message
        }
      }
    } catch (error) {
      console.error('An error occurred:', error);
      alert('An error occurred during login. Please try again.');
    }
  };  

  return (
    <div className="login-container">
      <nav className="navbar">
        <Link to="/" className="navbar-title">EasyBank</Link>
        <div className="navbar-links">
          <Link to="/login" className="nav-link">Employee Portal</Link>
          <Link to="/login" className="nav-link">Customer Portal</Link>
        </div>
      </nav>
      <div className="login-box">
        <h2 className="login-title">Login</h2>
        <p className="login-subtitle">Welcome back. Please login with your account details.</p>
        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
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

          <button type="submit" className="submit-btn">Login</button>
        </form>
        <p className="login-link">
          Return to <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;