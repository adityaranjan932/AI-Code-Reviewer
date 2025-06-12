// Super simple debug version without any syntax highlighting
import React, { useState, useEffect } from 'react';

const EditorPanelSimple = ({ initialCode = '', onReview, isLoading }) => {
  const [code, setCode] = useState(initialCode);

  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  const handleReviewClick = () => {
    if (isLoading) return;
    if (!code.trim()) {
        alert("Please provide code to review.");
        return;
    }
    onReview(code, null);
    setCode('');
  };

  const handleKeyDown = (e) => {
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
      padding: '16px',
    }}>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter your code here... (Ctrl+Enter to submit)"
        spellCheck={false}
        style={{
          flex: 1,
          width: '100%',
          backgroundColor: '#0c0c0c',
          color: '#ffffff',
          border: 'none',
          outline: 'none',
          resize: 'none',
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: '16px',
          lineHeight: '1.5',
          padding: '16px',
          borderRadius: '8px',
          caretColor: '#ffffff',
        }}
      />
      
      <button
        onClick={handleReviewClick}
        disabled={isLoading}
        style={{
          marginTop: '16px',
          backgroundColor: isLoading ? '#a0a0c0' : '#646cff',
          color: '#ffffff',
          padding: '0.75rem 2rem',
          fontWeight: 600,
          cursor: isLoading ? 'not-allowed' : 'pointer',
          borderRadius: '8px',
          border: 'none',
          fontSize: '14px',
          alignSelf: 'flex-end',
        }}
      >
        {isLoading ? 'Reviewing...' : 'Review'}
      </button>
    </div>
  );
};

export default EditorPanelSimple;
