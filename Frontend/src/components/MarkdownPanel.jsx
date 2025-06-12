// Frontend/src/components/MarkdownPanel.jsx
import React, { useRef, useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
// Removed highlight.js theme to prevent conflicts with editor styling
import './MarkdownPanel.css'; // We'll create this CSS file next

// Reusable CodeBlock component (can be in its own file too)
const CodeBlock = ({ children, className, ...props }) => {
  const codeRef = useRef(null);
  const [copied, setCopied] = useState(false);

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


const MarkdownPanel = ({ chatMessages = [], isLoading }) => {
  const chatContainerRef = useRef(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, isLoading]);

  return (
    <div className="markdown-panel-container">
      <div className="chat-container" ref={chatContainerRef}>
        {chatMessages.length === 0 && !isLoading ? (
          <div className="welcome-message">
            <Markdown>
              {"Submit code or an image for AI review to start a conversation."}
            </Markdown>
          </div>
        ) : (
          <div className="chat-messages">
            {chatMessages.map((message) => (
              <div key={message.id} className={`message ${message.type}`}>
                <div className="message-header">
                  <span className="message-sender">
                    {message.type === 'user' ? 'You' : 'AI Assistant'}
                  </span>
                  <span className="message-time">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="message-content">
                  {message.image && (
                    <div className="message-image">
                      <img 
                        src={URL.createObjectURL(message.image)} 
                        alt="Uploaded for review" 
                        style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '8px' }}
                      />
                    </div>
                  )}                  <Markdown
                    rehypePlugins={[rehypeHighlight]}
                    components={{
                      code: ({ node, inline, className, children, ...props }) => {
                        // Handle inline code differently from code blocks
                        if (inline) {
                          return <code className="inline-code" {...props}>{children}</code>;
                        }
                        // For code blocks, use our custom CodeBlock component
                        return <CodeBlock className={className} {...props}>{children}</CodeBlock>;
                      },
                      pre: ({ children }) => {
                        // Prevent nesting issues by returning just the children
                        return <>{children}</>;
                      }
                    }}
                  >
                    {message.content}
                  </Markdown>
                </div>
              </div>
            ))}
          </div>
        )}
        {isLoading && (
          <div className="message assistant thinking">
            <div className="message-header">
              <span className="message-sender">AI Assistant</span>
              <span className="message-time">
                {new Date().toLocaleTimeString()}
              </span>
            </div>
            <div className="message-content">
              <div className="thinking-indicator">
                <span className="thinking-text">Thinking</span>
                <div className="thinking-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarkdownPanel;
