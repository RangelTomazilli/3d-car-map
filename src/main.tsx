import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Import i18n configuration
import './services/i18n';

// Import global styles
import './styles/main.scss';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
