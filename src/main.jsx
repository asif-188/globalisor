import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { AppProvider } from './context/AppContext.jsx';
import App from './App.jsx';
import './index.css';

console.log('Main.jsx: Script starting (Full Load)...');

window.onerror = (message, source, lineno, colno, error) => {
  console.error('GLOBAL ERROR:', { message, source, lineno, colno, error });
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `<div style="padding: 20px; color: red; background: white; border: 2px solid red;">
      <h3>Runtime Error</h3>
      <p>${message}</p>
      <pre>${error?.stack || 'No stack'}</pre>
    </div>`;
  }
};

console.log('Main.jsx: Initializing React root...');
const rootElement = document.getElementById('root');
console.log('Main.jsx: root element:', rootElement);

if (rootElement) {
  try {
    console.log('Main.jsx: Rendering App...');
    createRoot(rootElement).render(
      <StrictMode>
        <BrowserRouter>
          <AppProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </AppProvider>
        </BrowserRouter>
      </StrictMode>
    );
    console.log('Main.jsx: Render command sent.');
  } catch (err) {
    console.error('RENDER ERROR:', err);
  }
} else {
  console.error('NO ROOT ELEMENT FOUND');
}



