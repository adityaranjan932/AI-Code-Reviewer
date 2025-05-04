import React, { useState, useCallback, useContext } from 'react'; // Add useContext
import axios from 'axios';
import './App.css';
import Navbar from './components/Navbar';
import EditorPanel from './components/EditorPanel';
import MarkdownPanel from './components/MarkdownPanel';
import AuthContext from './context/AuthContext'; // Import AuthContext

const defaultCode = `function sum(a, b) {
  return a + b;
}`;

// Configure axios to send cookies with requests (if not done in AuthContext)
// axios.defaults.withCredentials = true; // Can be set globally here too

function App() {
  const [review, setReview] = useState('');
  const [loadingReview, setLoadingReview] = useState(false); // Rename loading state
  const { user } = useContext(AuthContext); // Get user state if needed elsewhere

  const handleReviewRequest = useCallback(async (code, image) => {
    setLoadingReview(true); // Use specific loading state
    setReview('');
    try {
      let response;
      const endpoint = image
        ? 'http://localhost:3000/ai/image-review'
        : 'http://localhost:3000/ai/get-review';

      // Use axios instance configured with credentials if available
      // Create instance here to ensure it includes credentials for this specific request
      const axiosInstance = axios.create({ withCredentials: true });

      if (image) {
        const formData = new FormData();
        const promptToSend = code || "Describe or analyze this image.";
        formData.append('prompt', promptToSend);
        formData.append('image', image);
        response = await axiosInstance.post(endpoint, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        if (!code) {
            setReview("Please enter some code to review.");
            setLoadingReview(false);
            return;
        }
        response = await axiosInstance.post(endpoint, { code });
      }
      setReview(response.data);
    } catch (err) {
      const errorMessage = err.response?.data || err.message || 'An unknown error occurred.';
      // Check for specific auth errors if needed
      if (err.response?.status === 401) {
         setReview(`Error: Authentication required. Please log in.`);
         // Optionally trigger login modal here if desired
      } else {
         setReview(`Error: ${errorMessage}`);
      }
    } finally {
      setLoadingReview(false);
    }
  }, []);

  return (
    <>
      <Navbar /> {/* Navbar now handles its own auth state via context */}
      <main className="app-main-content">
        <div className="left-panel">
          <EditorPanel
            initialCode={defaultCode}
            onReview={handleReviewRequest}
            isLoading={loadingReview} // Pass review loading state
          />
        </div>
        <div className="right-panel">
          <MarkdownPanel
            review={review}
            isLoading={loadingReview} // Pass review loading state
          />
        </div>
      </main>
    </>
  );
}

export default App;