import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import { ErrorBoundary } from './components/ErrorBoundary.js';
import './index.css';

// Auto bust stale Service Worker / HTTP cache on new release
if (typeof window !== 'undefined') {
  const BUILD_VERSION = '20260905_v3_menu_editor';
  const savedVersion = localStorage.getItem('rapeephat_app_version');
  if (savedVersion && savedVersion !== BUILD_VERSION) {
    localStorage.setItem('rapeephat_app_version', BUILD_VERSION);
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach((name) => caches.delete(name));
      });
    }
    // Hard reload once to load fresh JS chunk
    window.location.reload();
  } else if (!savedVersion) {
    localStorage.setItem('rapeephat_app_version', BUILD_VERSION);
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
