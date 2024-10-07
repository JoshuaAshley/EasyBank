import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { UserContext } from '../../../UserContext';
import './paymentinfostyles.css';
import { FormDataContext } from '../../../FormDataContext';
import DOMPurify from 'dompurify'; // Import DOMPurify

const PaymentInfo = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { setUser } = useContext(UserContext);
  const { formData, setFormData } = useContext(FormDataContext);
  const navigate = useNavigate();

  const sanitizeInput = (input) => {
    return DOMPurify.sanitize(input);
  };

  const onSubmit = async (data) => {
    // Sanitize the form inputs
    const sanitizedData = {
      paymentAmount: sanitizeInput(data.paymentAmount),
      currency: sanitizeInput(data.currency),
      provider: sanitizeInput(data.provider)
    };

    const finalData = { ...formData, ...sanitizedData, paymentAmount: parseFloat(sanitizedData.paymentAmount) };

    setFormData(finalData); // Update the form data state
    navigate('/account-info');
  };

  const handleSignOut = () => {
    setUser(null); // Set user to null (log out)
    navigate('/login'); // Redirect to login
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
          <span className="breadcrumb-item active">Payment Info</span>
        </nav>
      </div>
      <div className="payment-box">
        <h2 className="payment-title">Payment Info</h2>
        <p className="payment-subtitle">Please enter your payment information for the transaction you are about to make.</p>
        <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
          {/* Payment Amount (only accepts numbers) */}
          <label className="input-label" htmlFor="paymentAmount">Payment Amount</label>
          <input
            type="number"
            placeholder="Payment Amount"
            className="input-field"
            {...register("paymentAmount", { required: "Payment amount is required" })}
          />
          {errors.paymentAmount && <span className="error-message">{errors.paymentAmount.message}</span>}

          {/* Currency Dropdown */}
          <label className="input-label" htmlFor="currency">Currency</label>
          <select
            className="input-field"
            {...register("currency", { required: "Currency is required" })}
          >
            <option value="">Select Currency</option>
            <option value="ZAR">ZAR</option>
            <option value="USD">USD</option>
            <option value="GBP">GBP</option>
            <option value="EUR">EUR</option>
            <option value="JPY">JPY</option>
          </select>
          {errors.currency && <span className="error-message">{errors.currency.message}</span>}

          {/* Provider Dropdown (only Swift option) */}
          <label className="input-label" htmlFor="provider">Provider</label>
          <select
            className="input-field"
            {...register("provider", { required: "Provider is required" })}
          >
            <option value="SWIFT">SWIFT</option>
          </select>
          {errors.provider && <span className="error-message">{errors.provider.message}</span>}

          <button type="submit" className="submit-btn">Submit Payment Info</button>
        </form>
        <p className="login-link">
        </p>
      </div>
    </div>
  );
};

export default PaymentInfo;