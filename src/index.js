// Import core libraries
import React from 'react';
import ReactDOM from 'react-dom/client';

// Import main App component
import App from './App';

// Initialize internationalization (i18n) before rendering the app
import './app/locale/i18n';

// Register service worker for offline support and faster load times
import * as serviceWorker from './serviceWorker';

// Get root DOM element
const rootElement = document.getElementById('root');

// Ensure root exists before rendering
if (rootElement) {
  // Create root and render app inside React.StrictMode (helps highlight potential issues)
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error('Root element not found. Make sure there is a div with id="root" in your index.html');
}

// Register service worker (uncomment below if you want offline support)
// Learn more: https://bit.ly/CRA-PWA
serviceWorker.register();
