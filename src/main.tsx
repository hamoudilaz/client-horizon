import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { PubKeyProvider } from './utils/PubKeyContext.jsx';
import { ThemeProvider } from './utils/ThemeContext';
import './styles/theme.css';
import './styles/dashboard.css';
import './styles/index.css';
import './styles/Navbar.css';

import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <ThemeProvider>
      <PubKeyProvider>
        <App />
      </PubKeyProvider>
    </ThemeProvider>
  </BrowserRouter>
);
