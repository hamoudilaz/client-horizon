import { useState, useEffect } from 'react';
import { refreshRef, wsolRef } from '../utils/constants';

type AmountData = {
  usdValue?: number;
  currentUsd?: number;
  SOL: number;
  WSOL?: number;
  SOLPRICE?: number;
};

export interface AmountProps {
  isDemo?: boolean;
  fetchAmount: () => Promise<AmountData | { valid: boolean; amount: AmountData }>;
}

export function Amount({ isDemo = false, fetchAmount: fetchFn }: AmountProps) {
  const [amount, setAmount] = useState<AmountData | null>(null);
  const [isBroke, setIsBroke] = useState<boolean>(false);

  const fetchAmount = async () => {
    const data = await fetchFn();

    // Handle demo response shape: { valid, amount }
    if (isDemo && 'valid' in data && data.valid) {
      const amountData = data.amount;
      setAmount(amountData);
      wsolRef.current = amountData.SOL;
      return;
    }

    // Handle prod response shape
    if (!isDemo && 'SOL' in data) {
      const owned = data as AmountData;
      setIsBroke(owned.usdValue === 0);
      setAmount(owned);
      wsolRef.current = owned.WSOL || 0;
    }
  };

  useEffect(() => {
    refreshRef.current = fetchAmount;
    fetchAmount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const usdValue = amount?.usdValue ?? amount?.currentUsd;

  return (
    <>
      <div className='display-container'>
        {!isDemo && isBroke && <strong> You are broke 😂</strong>}
        <div className='info-box sol-box'>
          <div>
            <span className='label blue SOL-price'>Current SOL price:</span>
            <span className='value blue sol-number'>
              {amount?.SOLPRICE ? `$${amount.SOLPRICE}` : <span className='placeholder' />}
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
              <span className='label blue'>Value in USD:</span>
              <span className='value blue'>
                {usdValue !== undefined ? `$${usdValue}` : <span className='placeholder' />}
              </span>
            </div>
            <div className='info-box'>
              <span className='label green'>SOL:</span>
              <span className='value green'>
                {amount?.SOL !== undefined ? `${amount.SOL} SOL` : <span className='placeholder' />}
              </span>
            </div>
            {!isDemo && (
              <div className='info-box'>
                <span className='label green'>Wrapped SOL:</span>
                <span className='value green'>
                  {amount?.WSOL !== undefined ? (
                    `${amount.WSOL} wSOL`
                  ) : (
                    <span className='placeholder' />
                  )}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
