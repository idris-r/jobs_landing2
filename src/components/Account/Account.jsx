import React, { useState } from 'react';
import './Account.css';
import { useAuth } from '../../context/AuthContext';
import { SectionHeader, Button } from '../common/CommonComponents';
import { 
  CreditCardIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  DocumentDuplicateIcon,
  ChatBubbleBottomCenterTextIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { PRICING_TIERS, FEATURE_DESCRIPTIONS } from '../../constants/pricing';

const Account = () => {
  const { user, login, register, logout } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const success = isLogin 
      ? login(email, password)
      : register(email, password);

    if (!success) {
      setError(isLogin 
        ? 'Invalid email or password' 
        : 'Email already exists'
      );
    } else {
      setEmail('');
      setPassword('');
    }
  };

  const handlePurchase = (tier) => {
    // This would be implemented with actual payment processing
    console.log(`Purchasing ${tier.label} tier: ${tier.tokens} tokens for $${tier.price}`);
  };

  const handleDeleteAccount = () => {
    // In a real app, this would make an API call
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = storedUsers.filter(u => u.email !== user.email);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    localStorage.removeItem('user');
    logout();
    setShowDeleteModal(false);
  };

  const renderPricingCard = (tier) => (
    <div key={tier.label} className={`pricing-card ${tier.popular ? 'popular' : ''}`}>
      {tier.popular && <div className="popular-badge">Most Popular</div>}
      <div className="pricing-header">
        <div className="pricing-name">{tier.label}</div>
        <div className="pricing-price">${tier.price}</div>
        <div className="pricing-tokens">{tier.tokens} tokens</div>
      </div>
      <button 
        className="buy-button"
        onClick={() => handlePurchase(tier)}
      >
        Buy Now
      </button>
    </div>
  );

  const renderFeaturesTable = () => (
    <table className="features-table">
      <thead>
        <tr>
          <th>Feature</th>
          <th>Description</th>
          <th>Token Cost</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(FEATURE_DESCRIPTIONS).map(([key, feature]) => (
          <tr key={key}>
            <td>
              <div className="feature-name-cell">
                {key === 'ANALYSIS' && <DocumentTextIcon className="feature-icon-table" />}
                {key === 'COVER_LETTER' && <DocumentDuplicateIcon className="feature-icon-table" />}
                {key === 'INTERVIEW' && <ChatBubbleBottomCenterTextIcon className="feature-icon-table" />}
                {feature.name}
              </div>
            </td>
            <td>
              <div className="feature-description">
                {feature.description}
                <div className="feature-detail">{feature.details}</div>
              </div>
            </td>
            <td>
              <div className="token-cost-cell">
                <CurrencyDollarIcon className="token-icon-small" />
                {feature.tokens} tokens
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const DeleteAccountModal = () => (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Delete Account</h3>
        <p>
          Are you sure you want to delete your account? This action cannot be undone 
          and you will lose all your remaining tokens and account history.
        </p>
        <div className="modal-actions">
          <button 
            className="modal-button cancel"
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </button>
          <button 
            className="modal-button delete"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );

  if (user) {
    return (
      <div className="account-section">
        <SectionHeader>Account</SectionHeader>
        <div className="auth-container">
          <div className="user-info">
            <p>Logged in as: {user.email}</p>
            <div className="token-balance">
              <CreditCardIcon className="token-icon" />
              <span className="token-amount">{user.tokenBalance} tokens available</span>
            </div>
            <Button onClick={logout}>Logout</Button>
          </div>

          <div className="pricing-section">
            <h3>Purchase Tokens</h3>
            <div className="pricing-grid">
              {Object.values(PRICING_TIERS).map(renderPricingCard)}
            </div>
          </div>

          <div className="features-section">
            <h3>Token Costs</h3>
            {renderFeaturesTable()}
          </div>

          <div className="account-actions">
            <button 
              className="delete-button"
              onClick={() => setShowDeleteModal(true)}
            >
              <TrashIcon className="delete-button-icon" />
              Delete Account
            </button>
          </div>
        </div>

        {showDeleteModal && <DeleteAccountModal />}
      </div>
    );
  }

  return (
    <div className="account-section">
      <SectionHeader>{isLogin ? 'Login' : 'Register'}</SectionHeader>
      <div className="auth-container">
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <Button type="submit">
            {isLogin ? 'Login' : 'Register'}
          </Button>
        </form>
        <div className="auth-switch">
          {isLogin ? (
            <>
              Don't have an account?{' '}
              <button onClick={() => setIsLogin(false)}>Register</button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button onClick={() => setIsLogin(true)}>Login</button>
            </>
          )}
        </div>

        <div className="pricing-section">
          <h3>Choose Your Plan</h3>
          <div className="pricing-grid">
            {Object.values(PRICING_TIERS).map(renderPricingCard)}
          </div>
        </div>

        <div className="features-section">
          <h3>Token Costs</h3>
          {renderFeaturesTable()}
        </div>
      </div>
    </div>
  );
};

export default Account;
