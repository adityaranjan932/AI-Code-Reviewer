import React, { useState, useEffect, useContext } from 'react';
// import axios from 'axios'; // Remove direct axios import
import { apiConnector } from '../services/apiConnector'; // Import apiConnector
import AuthContext from '../context/AuthContext';
import './ReviewHistoryModal.css';

const ReviewHistoryModal = ({ isOpen, onClose }) => {
  const { user, selectHistoryItem } = useContext(AuthContext); // Get selectHistoryItem from context
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (isOpen && user) {
      const fetchHistory = async () => {
        setLoading(true);
        setError(null);
        try {
          // const response = await axios.get('http://localhost:3000/api/auth/history', { // Old way
          //   withCredentials: true,
          // });
          const response = await apiConnector('GET', '/api/auth/history'); // New way
          if (response.data && response.data.status === 'success') {
            setHistory(response.data.data.history);
          } else {
            setError('Failed to fetch history.');
          }
        } catch (err) {
          console.error('Error fetching review history:', err);
          setError(err.response?.data?.message || 'An error occurred while fetching history.');
        } finally {
          setLoading(false);
        }
      };
      fetchHistory();
    }
  }, [isOpen, user]);

  // Handle escape key press
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      return () => {
        document.removeEventListener('keydown', handleEscapeKey);
      };
    }
  }, [isOpen, onClose]);

  const handleHistoryItemClick = (item) => {
    selectHistoryItem(item); // Use the function from context
    onClose(); // Close the modal
  };
  const handleCloseClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="review-history-modal-overlay" onClick={onClose}>
      <div className="review-history-modal-content" onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={handleCloseClick} 
          className="review-history-modal-close-btn"
          type="button"
          aria-label="Close modal"
        >
          &times;
        </button><h2>Review History</h2>
        {loading && <p className="loading-message">Loading history...</p>}
        {error && <p className="error-message">{error}</p>}
        {!loading && !error && history.length === 0 && <p className="empty-message">No review history found.</p>}
        {!loading && !error && history.length > 0 && (
          <ul className="history-list">
            {history.map((item) => (
              <li key={item._id} className="history-item" onClick={() => handleHistoryItemClick(item)}> {/* Add onClick handler */}
                <div className="history-item-header">
                  <strong>Reviewed At:</strong> {new Date(item.createdAt).toLocaleString()}
                </div>
                <div className="history-item-details">
                  <p><strong>Language:</strong> {item.language || 'N/A'}</p>
                  <p><strong>Code Snippet:</strong></p>
                  <pre className="code-snippet">
                    <code>{item.prompt.substring(0, 200)}{item.prompt.length > 200 ? '...' : ''}</code>
                  </pre>
                  <p><strong>Review:</strong></p>
                  <pre className="review-snippet">
                     <code>{item.reviewContent.substring(0, 300)}{item.reviewContent.length > 300 ? '...' : ''}</code>
                  </pre>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ReviewHistoryModal;
