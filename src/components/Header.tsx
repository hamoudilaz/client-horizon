import '../styles/Navbar.css';
import { SlCopyButton } from '@shoelace-style/shoelace/dist/react';
import { usePubKey } from '../utils/usePubKey';
import { logout } from '../services/loadKey';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link, useLocation } from 'react-router-dom';

export function Header() {
  const { pubKey, setPubKey, authenticated, setAuthenticated } = usePubKey();

  const location = useLocation();
  const isDemoPage = location.pathname === '/demo';
  const isStartPage = location.pathname === '/start';

  const clearStorage = async () => {
    await logout();
    localStorage.removeItem('pubKey');
    setPubKey(null);
    setAuthenticated(false);
  };

  return (
    <>
      <nav className='navbar'>
        <div className={`logoBox ${!authenticated && 'login'}`}>
          <h1 className='horizon-text'>HORIZON</h1>
        </div>
        {isDemoPage ? (
          <Link className='demo-button' to='/'>
            Back to Real Trading
          </Link>
        ) : (
          isStartPage && (
            <Link className='demo-button' to='/demo'>
              Demo (Simulated Trades)
            </Link>
          )
        )}

        {authenticated && (
          <>
            <div className='copyBox'>
              <label>Public Key:</label>
              <h2 className='displayKey'>{pubKey}</h2>
              <SlCopyButton value={pubKey ?? undefined} />
            </div>

            <div className='logout-container'>
              <button className='logout-btn LogoutBtn' onClick={clearStorage}>
                <LogoutIcon /> Logout
              </button>
            </div>
          </>
        )}
      </nav>
    </>
  );
}
