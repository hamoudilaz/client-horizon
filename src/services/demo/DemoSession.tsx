import { useState } from 'react';
import { startDemoSession } from './start.js';

type WalletProps = {
  demo: (amount: number) => void;
};

function Wallet({ demo }: WalletProps) {
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState('');

  const handleForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isNaN(amount) || amount <= 0) {
      setError('Amount must be a valid number');
      return;
    }

    setError('');
    const res = await startDemoSession(amount);
    if (res.error) return setError(res.error);
    console.log(res);
    demo(res.amount);
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
