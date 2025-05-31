import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { PubKeyProvider } from './utils/PubKeyContext.jsx';
import './styles/dashboard.css';
import './styles/index.css';
import './styles/Navbar.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <PubKeyProvider>
      <App />
    </PubKeyProvider>
  </BrowserRouter>
);
