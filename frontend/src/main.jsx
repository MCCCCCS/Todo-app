import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './style.css';   // Make sure this is imported here too

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);