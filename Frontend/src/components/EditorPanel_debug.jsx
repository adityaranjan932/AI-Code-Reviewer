// Debug version of EditorPanel - simplified to test text visibility
import React, { useRef, useState, useEffect } from 'react';
import Editor from 'react-simple-code-editor';
import { FaPlus, FaRegImage } from 'react-icons/fa';

const EditorPanelDebug = ({ initialCode = '', onReview, isLoading }) => {
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
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      width: '100%',
      backgroundColor: '#000000',
      borderRadius: '0.7rem',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <div style={{
        flex: 1,
        position: 'relative',
        backgroundColor: '#0c0c0c',
        borderRadius: '0.7rem',
        overflow: 'hidden',
        display: 'flex',
        minHeight: 0,
      }}>        <Editor
          value={code}
          onValueChange={newCode => setCode(newCode)}
          highlight={code => {
            // Return the code wrapped in a span with explicit white color
            return `<span style="color: #ffffff !important;">${code}</span>`;
          }}
          padding={16}
          textareaId="debug-code-editor"
          onKeyDown={handleKeyDown}
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 16,
            height: '100%',
            backgroundColor: '#0c0c0c',
            color: '#ffffff',
            caretColor: '#ffffff',
            flex: 1,
          }}
          textareaProps={{
            placeholder: "Enter your code here... (Ctrl+Enter to submit)",
            spellCheck: false,
            style: {
              outline: 'none',
              border: 'none',
              resize: 'none',
              backgroundColor: '#0c0c0c',
              color: '#ffffff',
              caretColor: '#ffffff',
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: '16px',
              lineHeight: '1.5',
            }
          }}
        />
        
        {/* Buttons absolutely positioned relative to code-editor-wrapper */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            background: '#23272f',
            border: '1px solid #444',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            padding: 0,
            zIndex: 10,
            transition: 'all 0.2s ease',
            color: '#fff',
          }}
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
          <span style={{
            position: 'absolute',
            bottom: '18px',
            left: '54px',
            fontSize: '12px',
            color: '#fff',
            background: '#23272f',
            padding: '4px 8px',
            borderRadius: '6px',
            zIndex: 10,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: 'calc(100% - 120px)',
            display: 'inline-flex',
            alignItems: 'center',
            border: '1px solid #444',
          }}>
            <FaRegImage size={12} style={{ marginRight: '4px' }} />
            {image.name}
          </span>
        )}
      </div>
      
      <button
        onClick={handleReviewClick}
        disabled={isLoading}
        title="Click to submit or use Ctrl+Enter"
        style={{
          position: 'absolute',
          bottom: '1rem',
          right: '1rem',
          backgroundColor: isLoading ? '#a0a0c0' : '#646cff',
          color: '#ffffff',
          padding: '0.75rem 2rem',
          fontWeight: 600,
          cursor: isLoading ? 'not-allowed' : 'pointer',
          userSelect: 'none',
          borderRadius: '8px',
          border: 'none',
          transition: 'all 0.2s ease',
          zIndex: 10,
          fontSize: '14px',
          boxShadow: '0 2px 8px rgba(100, 108, 255, 0.3)',
          opacity: isLoading ? 0.7 : 1,
        }}
      >
        {isLoading ? 'Reviewing...' : 'Review'}
      </button>
    </div>
  );
};

export default EditorPanelDebug;
