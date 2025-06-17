import { TradeForm } from '../components/TradeForm';
import { Amount } from '../components/AmountDisplay';
import { OwnedTokens } from './OwnedTokens';

export default function Dashboard() {
  return (
    <>
      <div className='main-container'>
        <Amount />

        <div className='trade-form'>
          <div className='trade-container main-trade-container'>
            <TradeForm />
          </div>
          <OwnedTokens />
        </div>
      </div>
    </>
  );
}
