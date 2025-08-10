import { Amount } from '../components/AmountDisplay';
import { TransferCard } from '../components/TransferCard';

export default function Transfer() {
  return (
    <>
      <div className='main-container'>
        <Amount />

        <div className='trade-form'>
          <div className='trade-container main-trade-container'>
            <TransferCard/>
          </div>
        </div>
      </div>
    </>
  );
}
