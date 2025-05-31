import { TradeForm } from '../components/TradeForm';
import { Amount } from '../components/AmountDisplay';
import { OwnedTokens } from './OwnedTokens';

export default function Dashboard() {
  return (
    <>
      <div className='main-container'>
        <Amount />

        <div className='trade-form'>
          <div>
            <h2 className='trade-settings'>Trade Settings</h2>
            <TradeForm />
          </div>
          <OwnedTokens />
        </div>
      </div>
    </>
  );
}
