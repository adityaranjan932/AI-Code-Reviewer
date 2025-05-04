// Frontend/src/components/SignupForm.jsx
import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext'; // Import AuthContext

const SignupForm = ({ onSwitchToLogin, onClose }) => { // Add onClose prop
  const [firstName, setFirstName] = useState(''); // Add firstName state
  const [lastName, setLastName] = useState('');   // Add lastName state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useContext(AuthContext); // Get signup function from context

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!firstName || !lastName) { // Validate names
        setError("First name and last name are required.");
        return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match!");
      return;
    }
    if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
    }
    setLoading(true);
    // Pass firstName and lastName to signup context function
    const result = await signup(firstName, lastName, email, password);
    setLoading(false);
    if (result.success) {
       onClose(); // Close modal on successful signup
    } else {
      setError(result.message || 'Signup failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Sign Up</h2>
       {error && <p style={{ color: 'red', textAlign: 'center', fontSize: '0.9em', marginBottom: '1rem' }}>{error}</p>}
       {/* Add First Name Input */}
       <label>
        First Name
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          disabled={loading}
        />
      </label>
      {/* Add Last Name Input */}
      <label>
        Last Name
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          disabled={loading}
        />
      </label>
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
        Password (min. 6 characters)
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
           minLength={6} // Add minLength validation
           disabled={loading}
        />
      </label>
      <label>
        Confirm Password
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
           disabled={loading}
        />
      </label>
      <button type="submit" disabled={loading}>
         {loading ? 'Signing up...' : 'Sign Up'}
      </button>
       <div className="auth-switch-link">
        Already have an account?{' '}
        <button type="button" onClick={onSwitchToLogin} disabled={loading}>
          Log in
        </button>
      </div>
    </form>
  );
};

export default SignupForm;
