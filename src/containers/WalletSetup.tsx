import { useState } from 'react';
import { LoadKey, validateKey } from '../services/loadKey';
import { usePubKey } from '../utils/usePubKey.js';

function Wallet() {
  const [privKey, setPrivKey] = useState('');
  const [error, setError] = useState('');

  const { setPubKey, setAuthenticated } = usePubKey();

  const handleForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateKey(privKey)) {
      setError('Invalid private key');
      return;
    }

    setError('');
    console.log(privKey);
    const res = await LoadKey(privKey);
    if (res.error) return setError(res.error);
    localStorage.setItem('pubKey', res.pubKey);
    setPubKey(res.pubKey);
    setAuthenticated(true);
    setPrivKey('');
  };

  return (
    <>
      <div className='main-container'>
        <form className='styleBox wallet' onSubmit={handleForm}>
          <label className='labbel'>Private Key:</label>
          <input
            type='text'
            placeholder='Input private key'
            className='privKey'
            value={privKey}
            onChange={(e) => setPrivKey(e.target.value)}
          />
          <button type='submit' className='bttn'>
            <span className='text'>Submit</span>
          </button>

          {error && <span className='status'>{error}</span>}
        </form>
      </div>
    </>
  );
}

export default Wallet;
