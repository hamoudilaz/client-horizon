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
    const owned = await getAmount();
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
      <div className='display-container'>
        {amount.usdValue === 0 && <strong> You are broke 😂</strong>}
        <div className='info-box sol-box'>
          <div>
            <span className='label blue SOL-price'>Current SOL price:</span>
            <span className='value blue sol-number'>
              {amount.SOLPRICE ? `$${amount.SOLPRICE}` : <span className='placeholder' />}
            </span>
          </div>
          <span>
            <a className='view-SOL' target='__blank' href='https://coinmarketcap.com/currencies/solana/'>
              View graph
            </a>
          </span>
        </div>
        <div className='holding-container'>
          <span className='label blue holding-label'>Wallet balance</span>
          <div className='amount-container'>
            <div className='info-box'>
              <span className='label blue'>Value in USD:</span>
              <span className='value blue'>
                {amount.usdValue !== undefined ? `$${amount.usdValue}` : <span className='placeholder' />}
              </span>
            </div>
            <div className='info-box'>
              <span className='label green'>SOL:</span>
              <span className='value green'>
                {amount.SOL !== undefined ? `${amount.SOL} SOL` : <span className='placeholder' />}
              </span>
            </div>
            <div className='info-box'>
              <span className='label green'>Wrapped SOL:</span>
              <span className='value green'>
                {amount.WSOL !== undefined ? `${amount.WSOL} wSOL` : <span className='placeholder' />}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
