import { Routes, Route, Navigate } from 'react-router-dom';
import { usePubKey } from './utils/usePubKey';
import Wallet from './containers/WalletSetup';
import Dashboard from './containers/Dashboard';
import { Header } from './components/Header';
import Demo from './containers/Demo';
import { useLocation } from 'react-router-dom';

import { useEffect } from 'react';

const App = () => {
  const location = useLocation();
  const isDemo = location.pathname === '/demo';

  const { pubKey, authenticated, demo } = usePubKey();
  useEffect(() => {
    const name = location.pathname === '/' ? 'Home' : location.pathname.slice(1);
    document.title = `Horizon | ${name.charAt(0).toUpperCase() + name.slice(1)}`;
  }, [location.pathname]);

  const isLoading = (!isDemo && authenticated === null) || (isDemo && demo === null);

  return (
    <div className='app-layout'>
      <Header />
      {isLoading ? (
        <div className='loading-container'>
          <div className='loading-spinner' />
        </div>
      ) : (
        <Routes>
          <Route path='/start' element={!pubKey ? <Wallet /> : <Navigate to='/dashboard' />} />
          <Route path='/dashboard' element={pubKey ? <Dashboard /> : <Navigate to='/' />} />
          <Route path='/demo' element={<Demo />} />
          <Route path='*' element={<Navigate to='/start' />} />
        </Routes>
      )}
    </div>
  );
};

export default App;
