import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import './index.css'
import App from './App.jsx'

// Global Axios configuration with graceful fallback for static/serverless deployments
axios.defaults.baseURL = import.meta.env.VITE_API_URL || '/api';
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Return graceful empty structure to prevent 500 errors in browser console
    return Promise.resolve({
      data: { success: false, data: [], message: 'Offline fallback mode active' },
      status: 200,
      offlineFallback: true
    });
  }
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
