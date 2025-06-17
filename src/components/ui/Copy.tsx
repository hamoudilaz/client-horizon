import { SlCopyButton } from '@shoelace-style/shoelace/dist/react';

export default function CopyContainer() {
  return (
    <>
      <div className='copyBox mintBox'>
        <label>Test token:</label>
        <h2 className='displayKey'> (RNDR Contract Address)</h2>
        <SlCopyButton
          value='rndrizKT3MK1iimdxRdWabcF7Zg7AR5T4nud4EkHBof'
          style={{ alignSelf: 'center' }}
        />
      </div>
    </>
  );
}
