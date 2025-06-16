import { useEffect, useState } from 'react';
import { getSessionAmount } from '../../services/demo/api';
import { refreshRef, wsolRef } from '../../utils/constants';

type AmountData = {
  initialAmount: number;
  currentUsd: number;
  SOL: number;
  SOLPRICE?: number;
};

export function Amount() {
  const [amount, setAmount] = useState<AmountData>();

  const fetchAmount = async () => {
    const data = await getSessionAmount();
    if (data.valid) {
      setAmount(data.amount);
      wsolRef.current = data.amount.SOL;

      console.log(data.amount);
    }
  };

  useEffect(() => {
    refreshRef.current = fetchAmount;
    fetchAmount();
  }, []);

  return (
    <>
      <div className='display-container'>
        <div className='info-box sol-box'>
          <div>
            <span className='label blue SOL-price'>Current SOL price:</span>
            <span className='value blue sol-number'>
              {amount ? `$${amount.SOLPRICE}` : <span className='placeholder' />}
            </span>
          </div>
          <span>
            <a
              className='view-SOL'
              target='__blank'
              href='https://coinmarketcap.com/currencies/solana/'
            >
              View graph
            </a>
          </span>
        </div>

        <div className='holding-container'>
          <span className='label blue holding-label'>Wallet balance</span>

          <div className='amount-container'>
            <div className='info-box'>
              <span className='label green'>SOL:</span>
              <span className='value green'>
                {amount ? `${amount.SOL} SOL` : <span className='placeholder' />}
              </span>
            </div>

            <div className='info-box'>
              <span className='label blue'>Value in USD:</span>
              <span className='value blue'>
                {amount ? `$${amount.currentUsd}` : <span className='placeholder' />}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
