import { useState} from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Avatar } from '@mui/material';


export const TransferCard = () => {

  const [selectedToken, setSelectedToken] = useState('');

  const handleChange = (event: any) => {
    setSelectedToken(event.target.value);
  };

  const tokens = [
    {
      id: 'sol',
      name: 'Solana',
      ticker: 'SOL',
      balance: 10.5,
      image: 'https://cryptologos.cc/logos/solana-sol-logo.png',
    },
    {
      id: 'eth',
      name: 'Ethereum',
      ticker: 'ETH',
      balance: 2.3,
      image: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    },
    {
      id: 'btc',
      name: 'Bitcoin',
      ticker: 'BTC',
      balance: 0.8,
      image: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
    },
  ];


  return (
    <>
      <form className='styleBox wallet tradeContent'>
        <h2 className='trade-settings'>Make a transfer</h2>
        <div className='trade-settings'>

        </div>
        <div className='config-container'>
          <label>Choose</label>

        </div>
          <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label" sx={{ color: 'white' }}>
          Token
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedToken}
          label="Token"
          onChange={handleChange}
        >
          {tokens.map((token) => (
            <MenuItem key={token.id} value={token.id} sx={{ backgroundColor:"black" }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar
                  src={token.image}
                  alt={token.ticker}
                  sx={{ width: 24, height: 24 }}
                />
                <span>{token.ticker}</span>
                <span style={{ marginLeft: 'auto' }}>
                  Balance: {token.balance}
                </span>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
        <div className='input-wrapper'>
          <input
            className='config-input'
            type='text'
         
            max={100}
            maxLength={100}
          
          />
        </div>


        <div className='fee-option'>
          <div className='slippage'>
            <div className='input-wrapper'>
              <label>Slippage (%):</label>
              <input
                className='config-input'
                type='text'
     
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
                placeholder='0.001'
   
              />
              <span className='input-symbol fee-symbol'>SOL</span>
            </div>
          </div>
   
        </div>



  
      </form>
    </>
  );
}


