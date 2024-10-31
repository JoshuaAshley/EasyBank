import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './homestyle.css';
import { UserContext } from '../../../UserContext';

const HomePage = () => {
  const [payments, setPayments] = useState([]);
  const { user, setUser } = useContext(UserContext); // Assuming you have user context with the logged-in user's details
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Conditionally fetch payments based on the user's account type
    const fetchPayments = async () => {
      try {
        let response;
        if (user.accountType === 'Customer') {
          response = await fetch(`https://localhost:3001/api/v1/payments/user-payments/${user.username}`);
        } else if (user.accountType === 'Employee') {
          response = await fetch(`https://localhost:3001/api/v1/payments/all-payments`);
        }

        if (response.ok) {
          const data = await response.json();
          setPayments(data.payments);
        } else {
          console.error('Failed to fetch payments:', response.statusText);
        }
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

  const handleVerifyPayment = (paymentId, username) => {
      navigate('/user/' + username + '/transaction-info/' + paymentId);
  };

  const filteredPayments = payments.filter(payment =>
    payment.accountHolderName.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      {/* Payments Section */}
      <div className="payments-section">
        {user.accountType === 'Customer' ? (
          <button className="create-payment-btn" onClick={handleCreatePayment}>Create New Payment</button>
        ) : (
          <input
            type="text"
            className="input-field"
            placeholder="Search payments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        )}

        {/* Display the list of payments */}
        <div className="payments-list">
          {filteredPayments && filteredPayments.length > 0 ? (
            filteredPayments.map(payment => (
              <div key={payment._id} className="payment-item">
                <h3>Payment of {payment.amount} {payment.currency}</h3>
                <p><strong>Account Holder:</strong> {payment.accountHolderName}</p>
                <p><strong>Bank:</strong> {payment.bank}</p>
                <p><strong>Account Number:</strong> {payment.accountNumber}</p>
                <p><strong>SWIFT Code:</strong> {payment.swiftCode}</p>
                <p><strong>Status: </strong>
                  {payment.verified === 'Verified' && 'Verified ✅'}
                  {payment.verified === 'Pending' && 'Pending Verification ⏳'}
                  {payment.verified === 'Declined' && 'Declined ❌'}
                </p>

                {/* Only show the "Verify" button if the user is an Employee */}
                {user.accountType === 'Employee' && (
                  <button
                    className="verify-btn"
                    onClick={() => handleVerifyPayment(payment._id, payment.username)}
                  >
                    Verify
                  </button>
                )}
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