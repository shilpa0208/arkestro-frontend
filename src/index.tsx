import React from 'react';
import App from './App';
import GlobalStyles from './styles/globalStyles';
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root') as Element;

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <GlobalStyles />
    <App />
  </React.StrictMode>
);