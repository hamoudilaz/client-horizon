import { useEffect, useState } from 'react';
import { getSessionAmount } from '../../services/demo/api';

type AmountData = {
  initialAmount: number;
  currentUsd: number;
  SOL: number;
  SOLPRICE?: number;
};

export function Amount() {
  const [amount, setAmount] = useState<AmountData>();

  useEffect(() => {
    const update = async () => {
      const data = await getSessionAmount();
      if (data.valid) {
        setAmount(data.amount); // not setAmount(data)
        console.log(data.amount);
      }
    };
    update();
  }, []);

  return (
    <>
      <div className='display-container'>
        <div className='info-box'>
          <span className='label blue SOL-price'>Current SOL price:</span>
          <span className='value blue'>${amount?.SOLPRICE}</span>
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
              <span className='label blue'>Value in USD:</span>
              <span className='value blue'>${amount?.currentUsd}</span>
            </div>
            <div className='info-box'>
              <span className='label green'>SOL:</span>
              <span className='value green'>{amount?.SOL} SOL</span>
            </div>
            <div className='info-box'>
              <span className='label yellow'>wSOL:</span>
              <span className='value yellow'>{amount?.SOL} WSOL</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
