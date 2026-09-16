
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';

// Catch and gracefully handle transient internal Firestore SDK assertion edge cases in preview environments
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    if (
      event?.message &&
      (event.message.includes('INTERNAL ASSERTION FAILED') ||
       event.message.includes('@firebase/firestore'))
    ) {
      console.warn('Suppressed internal Firestore SDK assertion error:', event.message);
      event.preventDefault();
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event?.reason;
    const msg = typeof reason === 'string' ? reason : reason?.message || '';
    if (
      msg &&
      (msg.includes('INTERNAL ASSERTION FAILED') ||
       msg.includes('@firebase/firestore'))
    ) {
      console.warn('Suppressed internal Firestore SDK unhandled rejection:', msg);
      event.preventDefault();
    }
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
