import { getAmount } from '../services/getAmount';
import { useState, useEffect } from 'react';
import { refreshRef, type ownAmount, wsolRef } from '../utils/constants';
// import { SlCopyButton } from '@shoelace-style/shoelace/dist/react';

export function Amount() {
  const [amount, setAmount] = useState<ownAmount>({
    usdValue: 0,
    SOL: 0,
    WSOL: 0,
    SOLPRICE: 0,
  });

  const fetchAmount = async () => {
    const pubKey = localStorage.getItem('pubKey') || '';
    const owned = await getAmount(pubKey);
    if (owned) {
      setAmount(owned);
      wsolRef.current = owned.WSOL;
    }
  };

  console.log(amount);

  useEffect(() => {
    refreshRef.current = fetchAmount;
    fetchAmount();
  }, []);
  return (
    <>
      {/* <div className='copyBox mintBox'>
        <label>Test mint:</label>
        <h2 className='displayKey'>rndrizKT3MK1iimdxRdWabcF7Zg7AR5T4nud4EkHBof</h2>
        <SlCopyButton value='rndrizKT3MK1iimdxRdWabcF7Zg7AR5T4nud4EkHBof' />
      </div> */}
      <div className='info-box'>
        <span className='label blue'>Current SOL price:</span>
        <span className='value blue'>${amount.SOLPRICE}</span>
      </div>
      <div className='amount-container'>
        <div className='info-box'>
          <span className='label blue'>Value in USD:</span>
          <span className='value blue'>${amount.usdValue}</span>
        </div>
        <div className='info-box'>
          <span className='label green'>SOL:</span>
          <span className='value green'>{amount.SOL} SOL</span>
        </div>
        <div className='info-box'>
          <span className='label yellow'>wSOL:</span>
          <span className='value yellow'>{amount.WSOL} WSOL</span>
        </div>
      </div>
    </>
  );
}
