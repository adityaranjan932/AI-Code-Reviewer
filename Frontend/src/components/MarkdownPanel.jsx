// Frontend/src/components/MarkdownPanel.jsx
import React, { useRef, useState } from 'react';
import Markdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css'; // Ensure styles are loaded
import './MarkdownPanel.css'; // We'll create this CSS file next

// Reusable CodeBlock component (can be in its own file too)
const CodeBlock = ({ children, className }) => {
  const codeRef = useRef(null);
  const [copied, setCopied] = useState(false);
  // const language = className ? className.replace('language-', '') : ''; // Language detection if needed

  const handleCopy = () => {
    if (codeRef.current) {
      navigator.clipboard.writeText(codeRef.current.innerText)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        })
        .catch(err => console.error('Failed to copy text: ', err));
    }
  };

  return (
    <div className="custom-code-block">
      <pre className={className}>
        <code ref={codeRef}>{children}</code>
      </pre>
      <button className="copy-btn" onClick={handleCopy}>
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
};


const MarkdownPanel = ({ review, isLoading }) => {
  return (
    <div className="markdown-panel-container">
      {isLoading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <Markdown
          rehypePlugins={[rehypeHighlight]}
          components={{
            code: CodeBlock, // Use custom CodeBlock for syntax highlighting and copy
          }}
        >
          {review || "Submit code or an image  for AI review."}
        </Markdown>
      )}
    </div>
  );
};

export default MarkdownPanel;
