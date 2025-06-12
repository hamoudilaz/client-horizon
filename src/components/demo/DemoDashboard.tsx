import { useState, useEffect, useRef } from 'react';
import { executeSwap } from '../../services/demo/buy.js';
import { ClipLoader } from 'react-spinners';
import { sellToken } from '../../services/demo/sell.js';
import { Switches } from '../ui/Switch.tsx';
import { type settings, type InputEvent } from '../../utils/constants.ts';
import validateInput from '../../helpers/validateForm.tsx';
import { refreshRef, wsolRef } from '../../utils/constants';

export function DemoTradeForm() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mess, setMess] = useState('');
  const [timer, setTimer] = useState('');
  const [mode, setMode] = useState(true);

  const [config, setConfig] = useState<settings>({
    mint: '',
    buyAmount: 0,
    sellAmount: 0,
    slippage: 10,
    fee: 0.000001,
    jitoFee: 0.00001,
    node: false,
  });

  const modeRef = useRef(mode);

  // async function buy(cfg: settings) {
  //   setLoading(true);
  //   try {
  //     const response = await executeSwap(cfg);
  //     console.log(response);

  //     if (response.error) {
  //       console.log(response.error);
  //       setError(response.error);
  //     } else {
  //       setTimer(response.end || '');
  //       setMess(response.message || '');
  //     }
  //   } catch (error: unknown) {
  //     setError((error as Error).message);
  //     console.error(error);
  //   } finally {
  //     refreshRef.current?.();

  //     setLoading(false);
  //   }
  // }

  const validateForm = () => {
    const wsol = wsolRef.current;

    const result = validateInput(config, wsol, mode, true);

    if (result !== true) {
      setError(result);
      return false;
    }

    setError('');
    return true;
  };

  const handleMint = (e: InputEvent) => {
    const CA: string = e.target.value;
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
    setLoading(true);

    try {
      if (mode) {
        const response = await executeSwap(config);
        if (response.error) {
          console.log(response.error);
          setError(response.error);
        } else {
          setTimer(response.end || '');
          setMess(response.message || '');
        }
      } else {
        const response = await sellToken(config);
        if (response.error) {
          setError(response.error);
        } else {
          setTimer(response.end);
          setMess(response.message);
        }
      }
    } catch (error: unknown) {
      setError((error as Error).message);
    } finally {
      refreshRef.current?.();
      setLoading(false);
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
      setConfig((prev) => ({ ...prev, jitoFee: 0.000001 }));
    }
  }, [config.node]);

  return (
    <>
      <form className='styleBox wallet tradeContent' onSubmit={handleSubmit}>
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

        <input type='text' value={config.mint} onChange={handleMint} placeholder='Enter Token CA' />
        <label>Amount in {mode ? 'wSOL' : '%'}</label>
        <div className='input-wrapper'>
          <input
            type='text'
            defaultValue=''
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
          <span className='input-symbol'>{mode ? 'wSOL' : '%'}</span>
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
                type='text'
                defaultValue=''
                placeholder='0.01'
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, jitoFee: Number(e.target.value) }))
                }
              />
              <span className='input-symbol fee-symbol'>wSOL</span>
            </div>
          </div>
          <div className='select'>
            <div className='fee-div'>
              <label>Base fee:</label> <small className='fee-view'>{config.fee}</small>
            </div>
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
        <button className='buy-btn bttn buybtn' type='submit' disabled={loading}>
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
