
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Detect if Tailwind is available; if not, load a minimal fallback stylesheet
(function ensureStyles() {
  try {
    const probe = document.createElement('div');
    probe.className = 'hidden';
    document.head.appendChild(probe);
    const hasTailwind = getComputedStyle(probe).display === 'none';
    probe.remove();
    if (!hasTailwind) {
      document.body.classList.add('tw-fallback');
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/styles/fallback.css';
      document.head.appendChild(link);
    }
  } catch {
    // ignore
  }
})();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
