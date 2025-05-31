import { useState, useEffect } from 'react';
import { executeSwap } from '../services/buy.js';
import { ClipLoader } from 'react-spinners';
import { sellToken } from '../services/sell.js';
import { usePubKey } from '../utils/usePubKey.ts';
import { Switches } from './ui/Switch';
import { rateLimit } from '../services/buy.ts';
import type { settings, InputEvent } from '../utils/constants';

export function TradeForm() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mess, setMess] = useState('');
  const [timer, setTimer] = useState('');
  const [mode, setMode] = useState(true);
  const [limit, setlimit] = useState(false);
  const [amountInput, setAmountInput] = useState('0.00001');
  const [config, setConfig] = useState<settings>({
    mint: '',
    amount: 0.00001,
    slippage: 10,
    fee: 0.000001,
    jitoFee: 0,
    node: false,
  });

  const { setPubKey } = usePubKey();

  async function buy(cfg: settings) {
    setLoading(true);
    try {
      const response = await executeSwap(cfg);
      console.log(response);
      if (response?.limit) {
        rateLimit(setlimit, setError, response.retryAfter || 20);
      }

      if (response.error) {
        if (response.error.startsWith('Internal Server Error: pubKey is undefined'))
          return setPubKey(null);
        console.log(response.error);
        setError(response.error);
      } else {
        setTimer(response.end || '');
        setMess(response.message || '');
      }
    } catch (error: unknown) {
      setError((error as Error).message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const validateForm = () => {
    if (config.mint.length < 43 || config.mint.length > 44) {
      setError('Invalid contract address');
      return false;
    }
    if (config.amount <= 0 || config.amount >= 5) {
      setError('Amount must be between 0 and 5');
      return false;
    }
    if (config.slippage <= 0.01) {
      setError('Slippage must be greater than 0.01');
      return false;
    }
    if (config.jitoFee > 0.01) {
      setError('Fee can maximum be 0.01');
      return false;
    }
    setError('');
    return true;
  };

  const handleMint = (e: InputEvent) => {
    const CA = e.target.value;
    setMess('');
    setTimer('');
    setError('');
    setConfig((prev) => ({ ...prev, mint: CA }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedConfig = {
      ...config,
      amount: Number(amountInput) || 0,
    };

    if (mode) {
      if (validateForm()) {
        buy(updatedConfig);
        setError('');
        setMess('');
      }
    } else {
      const response = await sellToken(updatedConfig);
      if (response.error) {
        setError(response.error);
      } else {
        setTimer(response.end);
        setMess(response.message);
      }
    }
  };

  const handleMode = () => {
    setMode((prev) => {
      const newMode = !prev;
      const newAmount = newMode ? 0.00001 : 100;
      setAmountInput(String(newAmount));

      setConfig((prevConfig) => ({
        ...prevConfig,
        amount: newAmount,
      }));
      return newMode;
    });
  };

  useEffect(() => {
    if (config.node) {
      setConfig((prev) => ({ ...prev, jitoFee: 0.001 }));
    } else {
      setConfig((prev) => ({ ...prev, jitoFee: 0.000001 }));
    }
  }, [config.node]);

  useEffect(() => {
    setAmountInput(String(config.amount));
  }, []);

  return (
    <>
      <form className='styleBox wallet tradeContent' onSubmit={handleSubmit}>
        <div className='trade-settings'>
          {timer ? (
            <p style={{ textAlign: 'center' }}>
              <strong className='timer'>Total Time: {timer}</strong>
            </p>
          ) : null}
          {mess ? (
            <p style={{ textAlign: 'center' }}>
              <strong className='success'>Successfull!</strong>
            </p>
          ) : null}
        </div>
        <label>Token Contract Address:</label>
        <button
          type='button'
          className={`float-end btn switch-mode ${mode ? 'sell' : 'buy'}`}
          onClick={handleMode}
        >
          Switch to {mode ? 'sell' : 'buy'}
        </button>
        <input type='text' value={config.mint} onChange={handleMint} placeholder='Enter Token CA' />
        <label>Amount:</label>

        <input
          type='text'
          value={amountInput}
          onChange={(e) => {
            setAmountInput(e.target.value);
            setError('');
          }}
          placeholder={mode ? '0.00001 SOL' : '100% (Sell percentage, without %, 50, 100...)'}
        />

        <Switches curr={config.node} mode={setConfig} />

        <div className='fee-option'>
          <div className='slippage'>
            <label>Slippage (%):</label>
            <input
              type='number'
              value={config.slippage}
              onChange={(e) => setConfig((prev) => ({ ...prev, slippage: Number(e.target.value) }))}
            />
          </div>
          <div className='slippage'>
            <label>Priority fee:</label>
            <input
              type='number'
              value={config.jitoFee}
              onChange={(e) => setConfig((prev) => ({ ...prev, jitoFee: Number(e.target.value) }))}
            />
          </div>
          <div className='select'>
            <label>Base fee:</label>
            <select
              value={config.fee}
              onChange={(e) => setConfig((prev) => ({ ...prev, fee: Number(e.target.value) }))}
            >
              <option value='0.003'>High</option>
              <option value='0.0001'>Low</option>
              <option value='0.000001'>Very low </option>
            </select>
          </div>
        </div>
        <button className='buy-btn bttn buybtn' type='submit' disabled={loading || limit}>
          {loading ? (
            <span className='text'>
              <ClipLoader size={20} color='#fff' />
            </span>
          ) : (
            <span className='text'>{mode ? 'buy' : 'sell'}</span>
          )}
        </button>
        {loading ? (
          <span className='status'>Executing ...</span>
        ) : (
          error && <span className='status'>{error}</span>
        )}
        {mess ? (
          <a href={mess} target='_blank' rel='noreferrer'>
            <span className='text'>View on Solscan</span>
          </a>
        ) : null}
      </form>
    </>
  );
}
