import '../styles/Navbar.css';
import { SlCopyButton } from '@shoelace-style/shoelace/dist/react';
import { usePubKey } from '../utils/usePubKey';
import { logout } from '../services/loadKey';
import LogoutIcon from '@mui/icons-material/Logout';

export function Header() {
  const { pubKey, setPubKey, authenticated, setAuthenticated } = usePubKey();

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

        {authenticated && (
          <>
            <div className='copyBox'>
              <label>Public Key:</label>
              <h2 className='displayKey'>{pubKey}</h2>
              <SlCopyButton value={pubKey ?? undefined} />
            </div>

            <button className='logout-btn LogoutBtn' onClick={clearStorage}>
              <LogoutIcon /> Logout
            </button>
          </>
        )}
      </nav>
    </>
  );
}
