import { DemoTradeForm } from '../components/demo/DemoDashboard';
import { OwnedTokens } from '../components/demo/DemoOwnedTokens';
import { Amount } from '../components/demo/DemoAmountDisplay';
import Wallet from '../services/demo/DemoSession';
import { resetDemo } from '../services/loadKey';
import { usePubKey } from '../utils/usePubKey';
import { useNavigate } from 'react-router-dom';

export default function Demo() {
  const { setAuthenticated, setValidDemo, demo } = usePubKey();
  const navigate = useNavigate();

  console.log(demo);
  if (!demo) return <Wallet />;

  return (
    <>
      <div className='main-container'>
        <Amount />

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
            <DemoTradeForm />
          </div>
          <OwnedTokens />
        </div>
      </div>
      -
    </>
  );
}
