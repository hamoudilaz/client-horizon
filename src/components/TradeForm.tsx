import { useState, useEffect, useRef } from 'react';
import { executeSwap } from '../services/buy.js';
import { ClipLoader } from 'react-spinners';
import { sellToken } from '../services/sell.js';
import { usePubKey } from '../utils/usePubKey.ts';
import { Switches } from './ui/Switch.tsx';
import { rateLimit } from '../services/buy.ts';
import { wsolRef, type settings, type InputEvent } from '../utils/constants.ts';
import validateInputs from '../utils/validateForm.ts';

export function TradeForm() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mess, setMess] = useState('');
  const [timer, setTimer] = useState('');
  const [mode, setMode] = useState(true);
  const [cache, setCache] = useState('');
  const [cacheVisible, setCacheVisible] = useState(false);

  const [limit, setlimit] = useState(false);
  const [config, setConfig] = useState<settings>({
    mint: '',
    buyAmount: 0,
    sellAmount: 0,
    slippage: 10,
    fee: 0.000001,
    jitoFee: 0,
    node: false,
  });

  const { setPubKey } = usePubKey();
  const modeRef = useRef(mode);

  useEffect(() => {
    if (cache) {
      setCacheVisible(true);
      const hide = setTimeout(() => setCacheVisible(false), 2000);
      const clear = setTimeout(() => setCache(''), 2300);
      return () => {
        clearTimeout(hide);
        clearTimeout(clear);
      };
    }
  }, [cache]);

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
    const wsol = wsolRef.current;
    console.log(config);
    console.log('VALIDATING MODE:', mode);

    const result = validateInputs(config, wsol, mode, false);

    if (result !== true) {
      setError(result);
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

    if (!validateForm()) return;
    setError('');
    setMess('');

    if (mode) {
      await buy(config);
    } else {
      const response = await sellToken(config);
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
      modeRef.current = newMode;

      setConfig((prevConfig) => ({
        ...prevConfig,
        buyAmount: newMode ? prevConfig.buyAmount : 0,
        sellAmount: newMode ? 0 : prevConfig.sellAmount,
      }));

      return newMode;
    });

    setError('');
    setTimer('');
    setMess('');
  };

  useEffect(() => {
    if (config.node) {
      setConfig((prev) => ({ ...prev, jitoFee: 0.001 }));
    } else {
      setConfig((prev) => ({ ...prev, jitoFee: 0 }));
    }
  }, [config.node]);

  const handleCache = () => {
    setError('');
    console.log(config);
    if (!config.buyAmount || !config.mint) return setError('Cannot save empty values!');
    localStorage.setItem('config', JSON.stringify(config));
    setCache('Updated settings ✅ ');
  };

  const handleCacheLoad = () => {
    setError('');
    const cached = localStorage.getItem('config');
    if (!cached) {
      return setError('You dont have any settings saved');
    }
    setCache('Successfully loaded settings! ✅');
    const loaded = JSON.parse(cached);
    setConfig((prev) => ({ ...prev, ...loaded }));
  };

  const removeCache = () => {
    setError('');
    const cached = localStorage.getItem('config');
    if (!cached) return setError('You dont have any settings to delete');
    localStorage.removeItem('config');
    setError('Settings cleared!');
  };

  return (
    <>
      <form className='styleBox wallet tradeContent' onSubmit={handleSubmit}>
        <h2 className='trade-settings'>Trade Settings</h2>
        <div className='trade-settings'>
          <div className='msg-content'>
            {timer ? (
              <p style={{ textAlign: 'center' }}>
                <strong className='timer'>Total Time: {timer}ms</strong>
              </p>
            ) : null}
            {mess ? (
              <p style={{ textAlign: 'center' }}>
                <strong className='success'>Successfull!</strong>
              </p>
            ) : null}
          </div>
        </div>
        <div className='config-container'>
          <label>Token Contract Address:</label>
          <button
            type='button'
            className={`btn switch-mode w-50 ${mode ? 'sell' : 'buy'}`}
            onClick={handleMode}
          >
            <b>Switch to: {mode ? 'sell' : 'buy'}</b>
          </button>
        </div>
        <input
          className='config-input'
          type='text'
          value={config.mint}
          onChange={handleMint}
          placeholder='Enter Token CA'
        />
        <label>Amount in {mode ? 'SOL' : '%'}</label>
        <div className='input-wrapper'>
          <input
            className='config-input'
            type='text'
            defaultValue={(mode && config.buyAmount) || ''}
            max={100}
            maxLength={100}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (modeRef.current) {
                setConfig((prev) => ({ ...prev, buyAmount: value, sellAmount: 0 }));
              } else {
                setConfig((prev) => ({ ...prev, sellAmount: value, buyAmount: 0 }));
              }
              setError('');
            }}
            placeholder={mode ? `0.0001` : '100% (Sell percentage, 50, 100...)'}
          />
          <span className='input-symbol'>{mode ? 'SOL' : '%'}</span>
        </div>

        <Switches
          curr={config.node}
          onChange={(checked) => setConfig((prev) => ({ ...prev, node: checked }))}
        />
        <div className='fee-option'>
          <div className='slippage'>
            <div className='input-wrapper'>
              <label>Slippage (%):</label>
              <input
                className='config-input'
                type='text'
                value={config.slippage}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, slippage: Number(e.target.value) }))
                }
              />
              <span className='input-symbol fee-symbol'>%</span>
            </div>
          </div>
          <div className='slippage'>
            <div className='input-wrapper'>
              <label>Priority fee:</label>

              <input
                className='config-input'
                type='text'
                defaultValue={(mode && config.jitoFee) || ''}
                placeholder='0.001'
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setConfig((prev) => ({ ...prev, jitoFee: value }));
                }}
              />
              <span className='input-symbol fee-symbol'>SOL</span>
            </div>
          </div>
          <div className='select'>
            <div className='fee-div'>
              <label>Base fee:</label> <small className='fee-view'>{config.fee}</small>
            </div>
            <select
              className='config-input'
              value={config.fee}
              onChange={(e) => setConfig((prev) => ({ ...prev, fee: Number(e.target.value) }))}
            >
              <option value='0.003'>High</option>
              <option value='0.0001'>Low</option>
              <option value='0.000001'>Very low </option>
            </select>
          </div>
        </div>
        <div className='settings-buttons'>
          <button type='button' onClick={handleCache}>
            save settings
          </button>
          <button type='button' onClick={handleCacheLoad}>
            Load settings
          </button>
          <button type='button' onClick={removeCache}>
            Clear settings
          </button>
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

        {cache && <span className={`status1 success ${cacheVisible ? 'show' : ''}`}>{cache}</span>}

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
