import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './homestyle.css';
import { UserContext } from '../../../UserContext';

const HomePage = () => {
  const [payments, setPayments] = useState([]);
  const { user, setUser } = useContext(UserContext); // Assuming you have user context with the logged-in user's details
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch payments for the logged-in user
    const fetchPayments = async () => {
      try {
        const response = await fetch(`https://localhost:3001/api/v1/payments/user-payments/${user.username}`);
        const data = await response.json();
        setPayments(data.payments);
      } catch (error) {
        console.error('Error fetching payments:', error);
      }
    };

    if (user) {
      fetchPayments();
    }
  }, [user]);

  const handleCreatePayment = () => {
    navigate('/payment-info'); // Navigate to the payment info page
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
          <Link to="/home" className="breadcrumb-item active">Home</Link>
        </nav>
      </div>

      {/* Payments List Section */}
      <div className="payments-section">
        <button className="create-payment-btn" onClick={handleCreatePayment}>Create New Payment</button>

        {/* Display the list of payments */}
        <div className="payments-list">
          {payments.length > 0 ? (
            payments.map(payment => (
              <div key={payment._id} className="payment-item">
                <h3>Payment of {payment.amount} {payment.currency}</h3>
                <p><strong>Account Holder:</strong> {payment.accountHolderName}</p>
                <p><strong>Bank:</strong> {payment.bank}</p>
                <p><strong>Account Number:</strong> {payment.accountNumber}</p>
                <p><strong>SWIFT Code:</strong> {payment.swiftCode}</p>
                <p><strong>Status:</strong> {payment.verified ? 'Verified ✅' : 'Pending Verification ⏳'}</p>
              </div>
            ))
          ) : (
            <p>No payments found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;