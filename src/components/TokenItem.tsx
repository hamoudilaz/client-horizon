import { useState } from 'react';
import { Switches } from '../components/ui/Switch';
import { ClipLoader } from 'react-spinners';
import type { Props } from '../utils/constants';
import { Loading } from './ui/Loading';

export function TokenItem({ token, loadingStates, handleSell }: Props) {
  const [node, setNode] = useState(false);

  return (
    <li className='tokenList'>
      <div>
        <img src={token.logoURI ? token.logoURI : 'vite.svg'} />
        <Switches curr={node} onChange={setNode} />
      </div>
      <span className='tokenInfo'>{token.tokenMint} </span>
      <span className='tokenInfo'>
        Ticker: <span className='value'>{token.symbol}</span>
      </span>
      <span className='tokenInfo'>
        Tokens:{' '}
        <span className='value'>
          {!token.tokenBalance
            ? 'Token is new, Cannot get amount, sry'
            : Number(token.tokenBalance)}
        </span>
      </span>
      <span className='tokenInfo'>
        Value:{' '}
        <span className='value'>
          {' '}
          {!token.usdValue ? 'Token is new, Cannot get amount, sry' : `$${Number(token.usdValue)}`}
        </span>
      </span>
      <div className='sellToken'>
        <button
          className='bttn'
          value='50'
          onClick={() => handleSell(token, 50, node)}
          disabled={loadingStates[`${token.tokenMint}-50`]}
        >
          {loadingStates[`${token.tokenMint}-50`] ? (
            <Loading value={true} />
          ) : (
            // <ClipLoader size={16} color='#fff' className='load' />

            <span className='text'>Sell 50%</span>
          )}
        </button>
        <button
          className='bttn'
          value='100'
          onClick={() => handleSell(token, 100, node)}
          disabled={loadingStates[`${token.tokenMint}-100`]}
        >
          {loadingStates[`${token.tokenMint}-100`] ? (
            <ClipLoader size={16} color='#fff' className='load' />
          ) : (
            <span className='text'>Sell 100%</span>
          )}
        </button>
      </div>
    </li>
  );
}
