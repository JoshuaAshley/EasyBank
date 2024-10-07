import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { UserContext } from '../../../UserContext';
import './accountinfostyles.css';
import { FormDataContext } from '../../../FormDataContext';

const AccountInfo = () => {
  const { register, handleSubmit, formState: { errors }, setValue, setError } = useForm();
  const { user, setUser } = useContext(UserContext);
  const { formData } = useContext(FormDataContext);
  const navigate = useNavigate();

  const namePattern = /^[a-zA-Z\s]{1,100}$/; // Allows only letters and spaces, up to 100 characters
  const accountNumberPattern = /^[0-9]{10,12}$/; // Allows 10-12 digits
  const swiftCodePattern = /^[A-Z0-9]{8,11}$/; // Allows alphanumeric characters, 8-11 in length

  // Set default account number once when the page loads
  useEffect(() => {
    if (user && user.accountNumber) {
      setValue('accountNumber', user.accountNumber); // Set the default value
    }
  }, [user, setValue]);

  const onSubmit = async (data) => {
    const username = user.username;
    const finalData = { ...formData, ...data, username };
    const payload = {
      amount: finalData.paymentAmount,
      currency: finalData.currency,
      provider: finalData.provider,
      accountHolderName: finalData.accountHolderName,
      bank: finalData.bank,
      accountNumber: finalData.accountNumber,
      swiftCode: finalData.swiftCode,
      username: finalData.username
    };
  
    try {
      const response = await fetch("https://localhost:3001/api/v1/payments/create", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert('Payment successful!');
        navigate("/home");
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

  const handleSignOut = () => {
    setUser(null); // Set user to null (log out)
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="register-container">
      <nav className="navbar">
        <Link to="/" className="navbar-title">EasyBank</Link>
        <div className="navbar-links">
          <button className="signout-btn" onClick={handleSignOut}>Sign Out</button>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="breadcrumb-container">
        <nav className="breadcrumb">
          <Link to="/home" className="breadcrumb-item">Home</Link> &gt;
          <Link to="/payment-info" className="breadcrumb-item">Payment Amount</Link> &gt;
          <Link to="/account-info" className="breadcrumb-item active">Account Info</Link>
        </nav>
      </div>

      <div className="account-box">
        <h2 className="account-title">Account Info</h2>
        <p className="register-subtitle">Please enter your account information to finalize the transaction.</p>
        <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
          
          {/* Account Holder Name */}
          <label className="input-label" htmlFor="accountHolderName">Account Holder Name</label>
          <input
            type="text"
            placeholder="Holder Name"
            className="input-field"
            {...register("accountHolderName", { 
              required: "Account holder name is required", 
              pattern: {
                value: namePattern,
                message: "Name must contain only letters and spaces"
              }
            })}
          />
          {errors.accountHolderName && <span className="error-message">{errors.accountHolderName.message}</span>}

          {/* Bank Selection */}
          <label className="input-label" htmlFor="bank">Bank</label>
          <select
            className="input-field"
            {...register("bank", { required: "Please select a bank" })}
          >
            <option value="">Select Bank</option>
            <option value="Standard Bank">Standard Bank</option>
            <option value="First National Bank">First National Bank</option>
            <option value="NedBank">NedBank</option>
            <option value="Capitec">Capitec</option>
            <option value="ABSA">ABSA</option>
            <option value="Other">Other</option>
          </select>
          {errors.bank && <span className="error-message">{errors.bank.message}</span>}

          {/* Account Number */}
          <label className="input-label" htmlFor="accountNumber">Account Number</label>
          <input
            type="text"
            placeholder="Account Number"
            className="input-field"
            {...register("accountNumber", { 
              required: "Account number is required", 
              pattern: {
                value: accountNumberPattern,
                message: "Account number must be 10 to 12 digits"
              }
            })}
          />
          {errors.accountNumber && <span className="error-message">{errors.accountNumber.message}</span>}

          {/* Swift Code */}
          <label className="input-label" htmlFor="swiftCode">Swift Code</label>
          <input
            type="text"
            placeholder="Swift Code"
            className="input-field"
            {...register("swiftCode", { 
              required: "Swift code is required", 
              pattern: {
                value: swiftCodePattern,
                message: "SWIFT code must be 8 to 11 characters long and alphanumeric"
              }
            })}
          />
          {errors.swiftCode && <span className="error-message">{errors.swiftCode.message}</span>}

          <button type="submit" className="submit-btn">Pay Now</button>
        </form>
        <p className="login-link"></p>
      </div>
    </div>
  );
};

export default AccountInfo;