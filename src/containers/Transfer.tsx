import { Amount } from '../components/AmountDisplay';
import { TransferCard } from '../components/TransferCard';
import { getAmount } from '../services/getAmount';

export default function Transfer() {
  return (
    <>
      <div className='main-container'>
        <Amount isDemo={false} fetchAmount={getAmount} />

        <div className='trade-form'>
          <div className='trade-container main-trade-container'>
            <TransferCard />
          </div>
        </div>
      </div>
    </>
  );
}
