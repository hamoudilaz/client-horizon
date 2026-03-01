import { TradeForm } from '../components/TradeForm';
import { OwnedTokens } from './OwnedTokens';
import { Amount } from '../components/AmountDisplay';
import Wallet from '../services/demo/DemoSession';
import { resetDemo } from '../services/loadKey';
import { usePubKey } from '../utils/usePubKey';
import { useNavigate } from 'react-router-dom';
import { demoServices } from '../services/trade';
import { mockUpdateBalance, getSessionAmount } from '../services/demo/api';
import { handleDemoMessage } from '../services/demo/handleWss';
import { refreshRef } from '../utils/constants';

export default function Demo() {
  const { setAuthenticated, setValidDemo, demo } = usePubKey();
  const navigate = useNavigate();

  if (!demo) return <Wallet />;

  return (
    <>
      <div className='main-container'>
        <Amount isDemo={true} fetchAmount={getSessionAmount} />

        <div className='trade-form'>
          <div className='trade-container'>
            <button
              className='loading demo-button reset-demo'
              onClick={async () => {
                await resetDemo();
                setAuthenticated(false);
                setValidDemo(false);
                navigate('/start');
              }}
            >
              Start New Demo Session
            </button>
            <TradeForm
              isDemo={true}
              executeSwap={demoServices.executeSwap}
              sellToken={demoServices.sellToken}
              onTradeComplete={() => refreshRef.current?.()}
            />
          </div>
          <OwnedTokens
            isDemo={true}
            sellToken={demoServices.sellToken}
            fetchTokens={demoServices.fetchTokens}
            updateBalance={mockUpdateBalance}
            handleMessage={handleDemoMessage}
            onSellComplete={() => refreshRef.current?.()}
          />
        </div>
      </div>
    </>
  );
}
