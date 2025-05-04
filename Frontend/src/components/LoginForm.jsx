// Frontend/src/components/LoginForm.jsx
import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext'; // Import AuthContext

const LoginForm = ({ onSwitchToSignup, onClose }) => { // Add onClose prop
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext); // Get login function from context

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      onClose(); // Close modal on successful login
    } else {
      setError(result.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Log In</h2>
      {error && <p style={{ color: 'red', textAlign: 'center', fontSize: '0.9em', marginBottom: '1rem' }}>{error}</p>}
      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
      </label>
      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />
      </label>
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Log In'}
      </button>
      <div className="auth-switch-link">
        Don't have an account?{' '}
        <button type="button" onClick={onSwitchToSignup} disabled={loading}>
          Sign up
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
