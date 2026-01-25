import ws from '../services/wsClient';
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Loading } from '../components/ui/Loading';
import { TokenItem } from '../components/TokenItem';
import type {
  Token,
  TokenSetter,
  stateChangeBool,
  SellResponse,
  settings,
} from '../utils/constants';

export interface OwnedTokensProps {
  isDemo?: boolean;
  sellToken: (config: settings) => Promise<SellResponse>;
  fetchTokens: (setTokens: TokenSetter) => Promise<void>;
  updateBalance: (setIsLoading: stateChangeBool) => Promise<Token[] | void>;
  handleMessage: (event: MessageEvent, setTokens: TokenSetter) => void;
  onSellComplete?: () => void;
}

export function OwnedTokens({
  isDemo = false,
  sellToken,
  fetchTokens,
  updateBalance,
  handleMessage,
  onSellComplete,
}: OwnedTokensProps) {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mess, setMess] = useState<string | false>(false);
  const [timer, setTimer] = useState(false);
  const [error, setError] = useState('');
  const [sellFee, setSellFee] = useState(0.002);

  const [loadingStates, setLoadingStates] = useState({});

  useEffect(() => {
    fetchTokens(setTokens);

    const handler = (e: MessageEvent) => handleMessage(e, setTokens);

    ws.addEventListener('message', handler);

    return () => ws.removeEventListener('message', handler);
  }, [fetchTokens, handleMessage]);

  const handleSell = async (token: Token, percent: number, node: boolean) => {
    // Fee validation only for non-demo
    if (!isDemo) {
      if (isNaN(sellFee) || sellFee >= 0.1 || sellFee < 0) {
        setError('Invalid fee value');
        return;
      }
      if (sellFee > 0.0001 && sellFee < 0.1) {
        setSellFee(sellFee);
      }
    }

    const key = `${token.tokenMint}-${percent}`;
    setLoadingStates((prev) => ({ ...prev, [key]: true }));

    const sell = await sellToken({
      mint: token.tokenMint,
      sellAmount: percent,
      buyAmount: 0,
      node,
      slippage: 25,
      fee: node ? 0.0001 : 0.00001,
      jitoFee: node ? (isDemo ? 0.001 : sellFee) : 0.00001,
    });

    if (sell?.error) {
      setError(sell.error);
    } else {
      setMess(sell.message || false);
      setTimer(sell.end as unknown as boolean);
      onSellComplete?.();
    }

    setLoadingStates((prev) => ({ ...prev, [key]: false }));
  };

  const handleUpdateClick = async () => {
    const result = await updateBalance(setIsLoading);
    // For production, updateBalance returns new tokens to append
    if (!isDemo && Array.isArray(result) && result.length > 0) {
      setTokens((prev) => [...prev, ...result]);
    }
  };

  return (
    <>
      <div className='owned-tokens owned-pos'>
        <div className='header'>
          <h2 className='ownedHeader'>
            {tokens.length === 0 ? 'No tokens found' : 'Owned tokens'}
          </h2>

          <div
            style={{
              width: '100%',
              height: '52px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isDemo ? (
              // Demo: only show button when tokens exist
              tokens.length !== 0 &&
              (isLoading ? (
                <Loading />
              ) : (
                <button
                  className='loading demo-button'
                  style={{ width: '100%' }}
                  onClick={handleUpdateClick}
                >
                  Update
                </button>
              ))
            ) : isLoading ? (
              <Loading />
            ) : (
              <button
                className='loading demo-button'
                style={{ width: '100%' }}
                onClick={handleUpdateClick}
              >
                Update
              </button>
            )}
          </div>
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

        {/* Sell fee input only for production */}
        {!isDemo && tokens.length > 0 && (
          <input
            className='sell-fee-input'
            type='text'
            onChange={(e) => setSellFee(Number(e.target.value))}
            placeholder='Sell Fee override (optional)'
          />
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
