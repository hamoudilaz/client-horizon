import { Routes, Route, Navigate } from 'react-router-dom';
import { usePubKey } from './utils/usePubKey';
import Wallet from './containers/WalletSetup';
import Dashboard from './containers/Dashboard';
import { Header } from './components/Header';
import Demo from './containers/Demo';
import { useLocation } from 'react-router-dom';

const App = () => {
  const location = useLocation();
  const isDemo = location.pathname === '/demo';

  const { pubKey, authenticated } = usePubKey();

  if (!isDemo && authenticated === null) return null;

  return (
    <div className='app-layout'>
      <Header />
      <Routes>
        <Route path='/start' element={!pubKey ? <Wallet /> : <Navigate to='/dashboard' />} />
        <Route path='/dashboard' element={pubKey ? <Dashboard /> : <Navigate to='/' />} />
        <Route path='/demo' element={<Demo />} />
        <Route path='*' element={<Navigate to='/start' />} />
      </Routes>
    </div>
  );
};

export default App;
