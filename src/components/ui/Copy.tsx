import { SlCopyButton } from '@shoelace-style/shoelace/dist/react';

export default function CopyContainer() {
  return (
    <>
      <div className='copyBox mintBox'>
        <label>Test token:</label>
        <h2 className='displayKey'> (BONK Contract Address)</h2>
        <SlCopyButton
          value='DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263'
          style={{ alignSelf: 'center' }}
        />
      </div>
    </>
  );
}
