import { Routes, Route, Navigate } from 'react-router-dom';
import { usePubKey } from './utils/usePubKey';
import Wallet from './containers/WalletSetup';
import Dashboard from './containers/Dashboard';
import { Header } from './components/Header';

const App = () => {
  const { pubKey, authenticated } = usePubKey();

  if (authenticated === null) return null;

  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={!pubKey ? <Wallet /> : <Navigate to='/dashboard' />} />
        <Route path='/dashboard' element={pubKey ? <Dashboard /> : <Navigate to='/' />} />
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </>
  );
};

export default App;
