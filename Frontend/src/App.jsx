import React, { useState, useCallback, useContext, useEffect } from 'react';
import { apiConnector } from './services/apiConnector';
import './App.css';
import Navbar from './components/Navbar';
import EditorPanel from './components/EditorPanelWorking';
import MarkdownPanel from './components/MarkdownPanel';
import AuthContext from './context/AuthContext';
import AuthModal from './components/AuthModal';

const defaultCode = `function sum(a, b) {
  return a + b;
}`;

function App() {
  const [chatMessages, setChatMessages] = useState([]);
  const [loadingReview, setLoadingReview] = useState(false);
  const {
    user,
    selectedHistoryItem,
    clearSelectedHistoryItem,
    openAuthModal,
  } = useContext(AuthContext);
  const [currentEditorCode, setCurrentEditorCode] = useState(defaultCode);
  const [currentChatId, setCurrentChatId] = useState(Date.now());
  useEffect(() => {
    if (selectedHistoryItem) {
      setCurrentEditorCode(selectedHistoryItem.code || '');
      // Load history item as first message in chat
      setChatMessages([
        {
          id: Date.now(),
          type: 'user',
          content: selectedHistoryItem.code || '',
          timestamp: new Date()
        },
        {
          id: Date.now() + 1,
          type: 'assistant',
          content: selectedHistoryItem.review || '',
          timestamp: new Date()
        }
      ]);
      clearSelectedHistoryItem();
    }
  }, [selectedHistoryItem, clearSelectedHistoryItem]);

  const handleNewChat = useCallback(() => {
    setChatMessages([]);
    setCurrentEditorCode(defaultCode);
    setCurrentChatId(Date.now());
    setLoadingReview(false);
  }, []);
  const handleReviewRequest = useCallback(async (code, image) => {
    setLoadingReview(true);
    
    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: code || 'Image uploaded for review',
      image: image,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    
    try {
      let response;
      const endpoint = image ? '/ai/image-review' : '/ai/get-review';

      if (image) {
        const formData = new FormData();
        const promptToSend = code || "Describe or analyze this image.";
        formData.append('prompt', promptToSend);
        formData.append('image', image);
        response = await apiConnector('POST', endpoint, formData, { 'Content-Type': 'multipart/form-data' });
      } else {
        if (!code) {
          const errorMessage = "Please enter some code to review.";
          setChatMessages(prev => [...prev, {
            id: Date.now(),
            type: 'assistant',
            content: errorMessage,
            timestamp: new Date()
          }]);
          setLoadingReview(false);
          return;
        }
        const codeLanguage = 'javascript';
        response = await apiConnector('POST', endpoint, { code, language: codeLanguage });
      }
      
      // Add assistant response to chat
      const assistantMessage = {
        id: Date.now(),
        type: 'assistant',
        content: response.data,
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, assistantMessage]);
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data || err.message || 'An unknown error occurred.';
      
      if (err.response?.status === 401) { 
        openAuthModal('Your session might have expired or an authentication error occurred. Please sign up or log in.');
      } else {
        const errorAssistantMessage = {
          id: Date.now(),
          type: 'assistant',
          content: `Error: ${errorMessage}`,
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, errorAssistantMessage]);
      }
    } finally {
      setLoadingReview(false);
    }
  }, [user, openAuthModal]);
  return (
    <>
      <Navbar onNewChat={handleNewChat} />
      <AuthModal /> {/* Render AuthModal here; it will use context for state */}
      <main className="app-main-content">
        <div className="left-panel">
          <EditorPanel
            key={currentChatId}
            initialCode={currentEditorCode}
            onReview={handleReviewRequest}
            isLoading={loadingReview}
          />
        </div>
        <div className="right-panel">
          <MarkdownPanel 
            chatMessages={chatMessages} 
            isLoading={loadingReview} 
          />
        </div>
      </main>
    </>
  );
}

export default App;