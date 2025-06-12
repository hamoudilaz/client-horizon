import { Routes, Route, Navigate } from 'react-router-dom';
import { usePubKey } from './utils/usePubKey';
import Wallet from './containers/WalletSetup';
import Dashboard from './containers/Dashboard';
import { Header } from './components/Header';
import Demo from './containers/Demo';

const App = () => {
  const { pubKey, authenticated } = usePubKey();

  if (authenticated === null) return null;

  return (
    <>
      <Header />
      <Routes>
        <Route path='/start' element={!pubKey ? <Wallet /> : <Navigate to='/dashboard' />} />
        <Route path='/dashboard' element={pubKey ? <Dashboard /> : <Navigate to='/' />} />
        <Route path='/demo' element={<Demo />} />
        <Route path='*' element={<Navigate to='/start' />} />
      </Routes>
    </>
  );
};

export default App;
