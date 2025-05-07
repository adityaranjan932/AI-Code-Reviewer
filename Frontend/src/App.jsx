import React, { useState, useCallback, useContext, useEffect } from 'react';
import { apiConnector } from './services/apiConnector';
import './App.css';
import Navbar from './components/Navbar';
import EditorPanel from './components/EditorPanel';
import MarkdownPanel from './components/MarkdownPanel';
import AuthContext from './context/AuthContext';
import AuthModal from './components/AuthModal';

const defaultCode = `function sum(a, b) {
  return a + b;
}`;

function App() {
  const [review, setReview] = useState('');
  const [loadingReview, setLoadingReview] = useState(false);
  const {
    user,
    selectedHistoryItem,
    clearSelectedHistoryItem,
    openAuthModal,
  } = useContext(AuthContext);
  const [currentEditorCode, setCurrentEditorCode] = useState(defaultCode);

  useEffect(() => {
    if (selectedHistoryItem) {
      setCurrentEditorCode(selectedHistoryItem.code || '');
      setReview(selectedHistoryItem.review || '');
      clearSelectedHistoryItem();
    }
  }, [selectedHistoryItem, clearSelectedHistoryItem]);

  const handleReviewRequest = useCallback(async (code, image) => {
    setLoadingReview(true);
    setReview('');
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
          setReview("Please enter some code to review.");
          setLoadingReview(false); // Ensure loading state is reset here
          return;
        }
        const codeLanguage = 'javascript';
        response = await apiConnector('POST', endpoint, { code, language: codeLanguage });
      }
      setReview(response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data || err.message || 'An unknown error occurred.';
      // Simplified error handling for 401, or adjust as needed if you want different behavior for logged-in vs anonymous 401s
      if (err.response?.status === 401) { 
        openAuthModal('Your session might have expired or an authentication error occurred. Please sign up or log in.');
      } else {
        setReview(`Error: ${errorMessage}`);
      }
    } finally {
      setLoadingReview(false);
    }
  }, [user, openAuthModal]); // Removed getAnonymousReviewCount, incrementAnonymousReviewCount from dependencies

  return (
    <>
      <Navbar />
      <AuthModal /> {/* Render AuthModal here; it will use context for state */}
      <main className="app-main-content">
        <div className="left-panel">
          <EditorPanel
            key={currentEditorCode}
            initialCode={currentEditorCode}
            onReview={handleReviewRequest}
            isLoading={loadingReview}
          />
        </div>
        <div className="right-panel">
          <MarkdownPanel review={review} isLoading={loadingReview} />
        </div>
      </main>
    </>
  );
}

export default App;