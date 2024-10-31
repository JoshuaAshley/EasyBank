import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import './transactioninfostyle.css';

const TransactionInfo = () => {
  const { register, handleSubmit, setValue } = useForm();
  const navigate = useNavigate();
  const { username, id } = useParams();

  const [currency, setCurrency] = useState(''); // State for currency

  const handleVerifyPayment = async () => {
    try {
      const response = await fetch(`https://localhost:3001/api/v1/payments/user-payments/${username}/${id}/verify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        alert('Verified Successfully');
        navigate('/home');
      } else {
        console.error('Failed to fetch payment data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching payment data:', error);
    }
  };

  const handleDeclinePayment = async () => {
    try {
      const response = await fetch(`https://localhost:3001/api/v1/payments/user-payments/${username}/${id}/decline`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        alert('Declined Successfully');
        navigate('/home');
      } else {
        console.error('Failed to fetch payment data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching payment data:', error);
    }
  };

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        const response = await fetch(`https://localhost:3001/api/v1/payments/user-payments/${username}/${id}`);
        if (response.ok) {
          const { payment } = await response.json();
          setValue('accountHolderName', payment.accountHolderName);
          setValue('bank', payment.bank);
          setValue('accountNumber', payment.accountNumber);
          setValue('swiftCode', payment.swiftCode);
          setValue('paymentAmount', payment.amount);
          setValue('currency', payment.currency);
          setCurrency(payment.currency); // Set currency state
        } else {
          console.error('Failed to fetch payment data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching payment data:', error);
      }
    };

    if (username && id) {
      fetchPaymentData();
    }
  }, [username, id, setValue]);

  const onSubmit = async () => {
    navigate('/home');
  };

  return (
    <div className="register-container">
      <nav className="navbar">
        <Link to="/" className="navbar-title">EasyBank</Link>
        <div className="navbar-links">
          <button className="signout-btn" onClick={() => navigate('/login')}>Sign Out</button>
        </div>
      </nav>

      <div className="breadcrumb-container">
        <nav className="breadcrumb">
          <Link to="/home" className="breadcrumb-item">Home</Link> &gt;
          <Link to="/account-info" className="breadcrumb-item active">Transaction Info</Link>
        </nav>
      </div>

      <div className="account-box">
        <h2 className="account-title">Transaction Info</h2>
        <p className="account-subtitle">Please review the transaction info to either verify or decline the online payment.</p>
        <form className="account-form" onSubmit={handleSubmit(onSubmit)}>

          {/* Account Holder Name */}
          <label className="input-label" htmlFor="accountHolderName">Account Holder Name</label>
          <input
            type="text"
            className="input-field"
            {...register("accountHolderName", { required: "Account holder name is required" })}
            disabled
          />

          {/* Bank Selection */}
          <label className="input-label" htmlFor="bank">Bank</label>
          <select
            className="input-field"
            {...register("bank", { required: "Please select a bank" })}
            disabled
          >
            <option value="Standard Bank">Standard Bank</option>
            <option value="First National Bank">First National Bank</option>
            <option value="NedBank">NedBank</option>
            <option value="Capitec">Capitec</option>
            <option value="ABSA">ABSA</option>
          </select>

          {/* Account Number */}
          <label className="input-label" htmlFor="accountNumber">Account Number</label>
          <input
            type="text"
            className="input-field"
            {...register("accountNumber", { required: "Account number is required" })}
            disabled
          />

          {/* Swift Code */}
          <label className="input-label" htmlFor="swiftCode">Swift Code</label>
          <input
            type="text"
            className="input-field"
            {...register("swiftCode", { required: "Swift code is required" })}
            disabled
          />

          {/* Payment Amount */}
          <label className="input-label" htmlFor="paymentAmount">Amount {currency && `(${currency})`}</label>
          <input
            type="text"
            className="input-field"
            {...register("paymentAmount", { required: "Amount is required" })}
            disabled
          />

          <div className="submit-btns">
            <button type="submit" className="verify-btn"
            onClick={() => handleVerifyPayment()}>
              Verify
              </button>
            <button type="submit" className="decline-btn"
            onClick={() => handleDeclinePayment()}>
              Decline
              </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionInfo;