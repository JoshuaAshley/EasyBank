import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { UserContext } from '../../../UserContext';
import './accountinfostyles.css';

const AccountInfo = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const onSubmit = (data) => {
    console.log(data);
    // You can handle the submitted account information here
  };

  const handleSignOut = () => {
    setUser(null); // Set user to null (log out)
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="account-container">
      <nav className="navbar">
        <Link to="/" className="navbar-title">EasyBank</Link>
        <div className="navbar-links">
          <button className="signout-btn" onClick={handleSignOut}>Sign Out</button>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="breadcrumb-container">
        <nav className="breadcrumb">
          <Link to="/" className="breadcrumb-item">Home</Link> &gt;
          <span className="breadcrumb-item">Payment Amount</span> &gt;
          <span className="breadcrumb-item active">Account Info</span>
        </nav>
      </div>

      <div className="account-box">
        <h2 className="account-title">Account Info</h2>
        <form className="account-form" onSubmit={handleSubmit(onSubmit)}>
          {/* Account Holder Name */}
          <label className="input-label" htmlFor="accountHolderName">Account Holder Name</label>
          <input
            type="text"
            placeholder="Holder Name"
            className="input-field"
            {...register("accountHolderName", { required: "Account holder name is required" })}
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
            {...register("accountNumber", { required: "Account number is required" })}
          />
          {errors.accountNumber && <span className="error-message">{errors.accountNumber.message}</span>}

          {/* Swift Code */}
          <label className="input-label" htmlFor="swiftCode">Swift Code</label>
          <input
            type="text"
            placeholder="Swift Code"
            className="input-field"
            {...register("swiftCode", { required: "Swift code is required" })}
          />
          {errors.swiftCode && <span className="error-message">{errors.swiftCode.message}</span>}

          <button type="submit" className="submit-btn">Pay Now</button>
        </form>
      </div>
    </div>
  );
};

export default AccountInfo;
