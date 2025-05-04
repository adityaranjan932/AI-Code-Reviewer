import React, { useState, useContext } from 'react';
import './Navbar.css';
import AuthModal from './AuthModal';
import AuthContext from '../context/AuthContext'; // Import AuthContext
import { FaUserCircle } from 'react-icons/fa'; // Example icon

// Simple Profile Dropdown (can be moved to its own file)
const ProfileDropdown = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  // Use first/last name if available, otherwise fallback to email initials
  const displayName = user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email;
  const initials = user.firstName && user.lastName
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : user.email ? user.email.substring(0, 2).toUpperCase() : '??';
  const avatarUrl = `https://api.dicebear.com/5.x/initials/svg?seed=${encodeURIComponent(initials)}`; // Use initials for seed

  return (
    <div className="profile-dropdown-container" style={{ position: 'relative' }}>
      <button onClick={() => setIsOpen(!isOpen)} className="profile-avatar-button">
        <img src={avatarUrl} alt="User Avatar" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
      </button>
      {isOpen && (
        <div className="profile-dropdown-menu" > {/* Style using CSS */} 
          <div style={{ padding: '10px', borderBottom: '1px solid #444' }}>
            Signed in as <br />
            {/* Display full name or email */}
            <strong>{displayName}</strong>
            {/* Optionally show email below name if name exists */}
            {user.firstName && user.lastName && <div style={{ fontSize: '0.8em', color: '#ccc', marginTop: '2px' }}>{user.email}</div>}
          </div>
          <button onClick={onLogout} className="logout-button"> {/* Style using CSS */} 
            Logout
          </button>
        </div>
      )}
    </div>
  );
};


const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, loading, logout } = useContext(AuthContext); // Get user and logout from context

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-spacer"></div>
        <div className="navbar-title">AI Code Reviewer</div>
        <div className="navbar-button-wrapper">
          {loading ? (
            <span>Loading...</span> // Show loading indicator
          ) : user ? (
            <ProfileDropdown user={user} onLogout={logout} />
          ) : (
            <button className="navbar-button" onClick={openModal}>
              Login / Signup
            </button>
          )}
        </div>
      </nav>
      {/* Render the modal conditionally */}
      {!user && <AuthModal isOpen={isModalOpen} onClose={closeModal} />}
    </>
  );
};


export default Navbar;
