import ws from '../services/wsClient';
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Loading } from '../components/ui/Loading';
import { sellToken } from '../services/sell';
import { fetchTokens, updateBalance } from '../services/api';
import type { Token } from '../utils/constants';
import { handleMessage } from '../utils/handleMessage';
import { TokenItem } from '../components/TokenItem';

export function OwnedTokens() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mess, setMess] = useState<string | false>(false);
  const [timer, setTimer] = useState(false);
  const [error, setError] = useState('');

  const [loadingStates, setLoadingStates] = useState({});

  useEffect(() => {
    fetchTokens(setTokens);

    const handler = (e: MessageEvent) => handleMessage(e, setTokens);

    ws.addEventListener('message', handler);

    return () => ws.removeEventListener('message', handler);
  }, []);

  const handleSell = async (token: Token, percent: number, node: boolean) => {
    const key = `${token.tokenMint}-${percent}`;
    setLoadingStates((prev) => ({ ...prev, [key]: true }));

    const sell = await sellToken({
      mint: token.tokenMint,
      sellAmount: percent,
      buyAmount: 0,
      node,
      slippage: 25,
      fee: node ? 0.0001 : 0.00001,
      jitoFee: node ? 0.001 : 0.00001,
    });

    if (sell?.error) {
      setError(sell.error);
    } else {
      setMess(sell.message);
      setTimer(sell.end);
    }

    setLoadingStates((prev) => ({ ...prev, [key]: false }));
  };

  return (
    <>
      <div className='owned-tokens owned-pos'>
        <div className='header'>
          <h2 className='ownedHeader'>
            {tokens.length === 0 ? 'No tokens found' : 'Owned tokens'}
          </h2>

          {tokens.length > 0 && !isLoading && null}

          {isLoading ? (
            <Loading />
          ) : (
            <button
              className='loading demo-button'
              onClick={async () => {
                setIsLoading(true);
                const newTokens = await updateBalance(setIsLoading);
                if (newTokens.length > 0) {
                  setTokens((prev) => [...prev, ...newTokens]);
                }
                setIsLoading(false);
              }}
            >
              Update
            </button>
          )}
        </div>
        {mess ? (
          <div className='mb-3 msg-sell'>
            <a href={mess} target='_blank' rel='noreferrer' className='sellMsg'>
              <span className='text msg-text'>View on Solscan</span>
            </a>
            <strong className='timer'>Total Time: {timer}</strong>
          </div>
        ) : (
          <div style={{ marginBottom: '20px' }}>
            <span className='error-msg'>{error}</span>
          </div>
        )}

        <ul className='tokenBox'>
          {tokens.map((token) => (
            <TokenItem
              key={token.tokenMint}
              token={token}
              loadingStates={loadingStates}
              handleSell={handleSell}
            />
          ))}
        </ul>
      </div>
    </>
  );
}
