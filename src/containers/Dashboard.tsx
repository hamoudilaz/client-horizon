import { TradeForm } from '../components/TradeForm';
import { Amount } from '../components/AmountDisplay';
import { OwnedTokens } from './OwnedTokens';
import { prodServices } from '../services/trade';
import { updateBalance } from '../services/api';
import { handleMessage } from '../utils/handleMessage';
import { usePubKey } from '../utils/usePubKey';
import { getAmount } from '../services/getAmount';

export default function Dashboard() {
  const { setPubKey } = usePubKey();

  return (
    <>
      <div className='main-container'>
        <Amount isDemo={false} fetchAmount={getAmount} />

        <div className='trade-form'>
          <div className='trade-container main-trade-container'>
            <TradeForm
              isDemo={false}
              executeSwap={prodServices.executeSwap}
              sellToken={prodServices.sellToken}
              onAuthError={() => setPubKey(null)}
              enableRateLimit={true}
            />
          </div>
          <OwnedTokens
            isDemo={false}
            sellToken={prodServices.sellToken}
            fetchTokens={prodServices.fetchTokens}
            updateBalance={updateBalance}
            handleMessage={handleMessage}
          />
        </div>
      </div>
    </>
  );
}
