// Frontend/src/components/EditorPanel.jsx
import React, { useRef, useState } from 'react';
import Editor from 'react-simple-code-editor';
import prism from 'prismjs';
import { FaPlus, FaRegImage } from 'react-icons/fa';
import './EditorPanel.css'; // We'll create this CSS file next

// Import prism languages if not already globally available
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import "prismjs/themes/prism-tomorrow.css"; // Ensure theme is loaded

const EditorPanel = ({ initialCode = '', onReview, isLoading }) => {
  const [code, setCode] = useState(initialCode);
  const [image, setImage] = useState(null);
  const fileInputRef = useRef();

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
    if (!code && !image) {
        alert("Please provide code or an image to review.");
        return;
    }
    onReview(code, image); // Pass code and image up to App.jsx
    // Optionally clear image after starting review
    // setImage(null);
  };

  return (
    <div className="editor-panel-container">
      <div className="code-editor-wrapper">
        <Editor
          value={code}
          onValueChange={newCode => setCode(newCode)}
          highlight={codeToHighlight => prism.highlight(codeToHighlight, prism.languages.javascript || prism.languages.clike, 'javascript')}
          padding={10}
          textareaId="code-editor-textarea"
          className="editor-textarea"
          style={{ // Minimal inline styles for basic editor function
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 16,
            outline: 0,
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
        className="review-button" // Positioned absolutely by CSS
        disabled={isLoading}
      >
        {isLoading ? 'Reviewing...' : 'Review'}
      </button>
    </div>
  );
};

export default EditorPanel;
