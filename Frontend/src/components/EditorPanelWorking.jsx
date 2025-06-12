// Working version of EditorPanel with simple textarea
import React, { useRef, useState, useEffect } from 'react';
import { FaPlus, FaRegImage } from 'react-icons/fa';
import './EditorPanel.css';
import './EditorTextVisible.css';

const EditorPanelWorking = ({ initialCode = '', onReview, isLoading }) => {
  const [code, setCode] = useState(initialCode);
  const [image, setImage] = useState(null);
  const fileInputRef = useRef();
  const textareaRef = useRef();

  // Update code when initialCode changes (for new chat)
  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
    // Reset file input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleReviewClick = () => {
    if (isLoading) return; // Prevent multiple clicks while loading
    // Basic validation: require code or an image
    if (!code.trim() && !image) {
        alert("Please provide code or an image to review.");
        return;
    }
    onReview(code, image); // Pass code and image up to App.jsx
    // Clear the editor after submitting (like ChatGPT)
    setCode('');
    // Clear image after starting review
    setImage(null);
  };

  const handleKeyDown = (e) => {
    // Submit on Ctrl+Enter
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handleReviewClick();
    }
    
    // Handle tab key for indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.target;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      // Insert tab character
      const newValue = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newValue);
      
      // Move cursor
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <div className="editor-panel-container">
      <div className="code-editor-wrapper">
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter your code here... (Ctrl+Enter to submit)"
          spellCheck={false}
          className="working-code-textarea"
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#0c0c0c',
            color: '#ffffff',
            border: 'none',
            outline: 'none',
            resize: 'none',
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: '16px',
            lineHeight: '1.5',
            padding: '16px',
            caretColor: '#ffffff',
            borderRadius: '0.7rem',
            boxSizing: 'border-box',
          }}
        />
        
        {/* Buttons absolutely positioned relative to code-editor-wrapper */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="plus-button"
          title="Upload image for review"
        >
          <FaPlus size={14} />
        </button>
        
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          style={{ display: 'none' }}
        />
        
        {image && (
          <span className="image-preview-badge">
            <FaRegImage size={12} className="image-preview-icon" />
            {image.name}
          </span>
        )}
      </div>
      
      <button
        onClick={handleReviewClick}
        className="review-button"
        disabled={isLoading}
        title="Click to submit or use Ctrl+Enter"
      >
        {isLoading ? 'Reviewing...' : 'Review'}
      </button>
    </div>
  );
};

export default EditorPanelWorking;
