import { useState } from 'react';
import { startDemoSession } from './start.js';
import { usePubKey } from '../../utils/usePubKey.js';

function Wallet() {
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState('');
  const { setValidDemo } = usePubKey();
  const handleForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isNaN(amount) || amount <= 0) {
      setError('Amount must be a valid number');
      return;
    }

    setError('');
    const res = await startDemoSession(amount);
    if (res.error) {
      setError(res.error);
      setValidDemo(false);
      return;
    }
    setValidDemo(true);
  };

  return (
    <div className='main-container'>
      <form className='styleBox wallet' onSubmit={handleForm}>
        <label className='labbel'>Enter demo balance ($):</label>
        <input
          type='number'
          placeholder='e.g. 300 (USD for demo trading)'
          className='privKey'
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        <button type='submit' className='bttn'>
          <span className='text'>Start Demo</span>
        </button>

        {error && <span className='status'>{error}</span>}
      </form>
    </div>
  );
}

export default Wallet;
