import React, { useState, useContext } from 'react';
import './Navbar.css';
import AuthModal from './AuthModal';
import AuthContext from '../context/AuthContext'; // Import AuthContext
import ReviewHistoryModal from './ReviewHistoryModal'; // Import ReviewHistoryModal
// import { FaUserCircle } from 'react-icons/fa'; // Example icon - uncomment if you add icons
// import { FaSignOutAlt } from 'react-icons/fa'; // Example for logout icon
// import { FaHistory } from 'react-icons/fa'; // Example for history icon

// Simple Profile Dropdown (can be moved to its own file)
const ProfileDropdown = ({ user, onLogout, onViewHistory }) => {
  const [isOpen, setIsOpen] = useState(false);
  const displayName = user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email;
  const initials = user.firstName && user.lastName
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : user.email ? user.email.substring(0, 2).toUpperCase() : '??';
  const avatarUrl = `https://api.dicebear.com/5.x/initials/svg?seed=${encodeURIComponent(initials)}&backgroundColor=282c34&fontColor=ffffff&fontSize=45`;

  return (
    <div className="profile-dropdown-container" style={{ position: 'relative' }}>
      <button onClick={() => setIsOpen(!isOpen)} className="profile-avatar-button"> {/* Reverted to avatar button class */}
        <img src={avatarUrl} alt="User Avatar" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
      </button>
      {isOpen && (
        <div className="profile-dropdown-menu">
          <div className="user-info-section">
            <img src={avatarUrl} alt="User Avatar" className="dropdown-avatar-img" /> {/* Added class for specific styling if needed */}
            <div className="user-details">
              <strong>{displayName}</strong>
              {user.email && <div className="user-email">{user.email}</div>}
            </div>
          </div>
          <div className="dropdown-actions">
            <button onClick={onViewHistory} className="dropdown-action-button">
              {/* <FaHistory /> Optional icon */}
              View History
            </button>
            <button onClick={onLogout} className="dropdown-action-button logout-button-specific">
              {/* <FaSignOutAlt /> Optional icon */}
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false); // State for history modal
  const { user, loading, logout } = useContext(AuthContext);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openHistoryModal = () => setIsHistoryModalOpen(true); // Function to open history modal
  const closeHistoryModal = () => setIsHistoryModalOpen(false); // Function to close history modal

  return (
    <>
      <nav className="navbar">
        <div className="navbar-spacer"></div>
        <div className="navbar-title">AI Code Reviewer</div>
        <div className="navbar-button-wrapper">
          {loading ? (
            <span>Loading...</span>
          ) : user ? (
            <ProfileDropdown user={user} onLogout={logout} onViewHistory={openHistoryModal} />
          ) : (
            <button className="navbar-button" onClick={openModal}>
              Login / Signup
            </button>
          )}
        </div>
      </nav>
      {!user && <AuthModal isOpen={isModalOpen} onClose={closeModal} />}
      {user && <ReviewHistoryModal isOpen={isHistoryModalOpen} onClose={closeHistoryModal} />} {/* Render ReviewHistoryModal */}
    </>
  );
};

export default Navbar;
