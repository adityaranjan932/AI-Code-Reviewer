// Frontend/src/components/EditorPanel.jsx
import React, { useRef, useState, useEffect } from 'react';
import Editor from 'react-simple-code-editor';
import prism from 'prismjs';
import { FaPlus, FaRegImage } from 'react-icons/fa';
import './EditorPanel.css';
import './EditorTextVisible.css';

// Import prism languages if not already globally available
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
// Removed prism theme import as it's conflicting with our custom colors

const EditorPanel = ({ initialCode = '', onReview, isLoading }) => {
  const [code, setCode] = useState(initialCode);
  const [image, setImage] = useState(null);
  const fileInputRef = useRef();

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
  };
  return (
    <div className="editor-panel-container">
      <div className="code-editor-wrapper">        <Editor
          value={code}
          onValueChange={newCode => setCode(newCode)}
          highlight={code => {
            // Return empty string to disable highlighting completely
            // This prevents any overlay issues
            return '';
          }}
          padding={16}
          textareaId="code-editor-textarea"
          className="editor-textarea"
          onKeyDown={handleKeyDown}
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 16,
            outline: 0,
            height: '100%',
            backgroundColor: '#0c0c0c',
            color: '#ffffff',
            caretColor: '#ffffff',
          }}
          textareaProps={{
            placeholder: "Enter your code here... (Ctrl+Enter to submit)",
            spellCheck: false,
            style: {
              outline: 'none',
              border: 'none',
              resize: 'none',
              backgroundColor: '#0c0c0c !important',
              color: '#ffffff !important',
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: '16px',
              lineHeight: '1.5',
            }
          }}        />
        
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

export default EditorPanel;
