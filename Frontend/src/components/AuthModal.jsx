// Frontend/src/components/AuthModal.jsx
import React, { useState, useEffect } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose }) => {
  const [isLoginView, setIsLoginView] = useState(true); // Start with login view

  // Effect to handle closing modal on Escape key press
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  // Prevent modal from closing when clicking inside the content
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  if (!isOpen) {
    return null;
  }

  return (
    // Overlay handles background click to close
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal-content" onClick={handleContentClick}>
        <button className="auth-modal-close-btn" onClick={onClose}>&times;</button>
        {isLoginView ? (
          <LoginForm
            onSwitchToSignup={() => setIsLoginView(false)}
            onClose={onClose} // Pass onClose down
          />
        ) : (
          <SignupForm
            onSwitchToLogin={() => setIsLoginView(true)}
            onClose={onClose} // Pass onClose down
          />
        )}
      </div>
    </div>
  );
};

export default AuthModal;
