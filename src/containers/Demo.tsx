import { DemoTradeForm } from '../components/demo/DemoDashboard';
import { OwnedTokens } from '../components/demo/DemoOwnedTokens';
import { Amount } from '../components/demo/DemoAmountDisplay';
import { SlCopyButton } from '@shoelace-style/shoelace/dist/react';
import Wallet from '../services/demo/DemoSession';
import { useState, useEffect } from 'react';
import { checkDemo } from '../services/demo/api';
import { resetDemo } from '../services/loadKey';
import { usePubKey } from '../utils/usePubKey';
import { useNavigate } from 'react-router-dom';

export default function Demo() {
  const [demo, setDemo] = useState(0);

  const { setAuthenticated } = usePubKey();
  const navigate = useNavigate();

  useEffect(() => {
    const validate = async () => {
      const data = await checkDemo();
      console.log(data);
      if (data.error) {
        setDemo(0);
      } else {
        console.log(data);
        setDemo(data.valid);
      }
    };

    validate();
  }, []);

  const clearStorage = async () => {
    await resetDemo();
    setAuthenticated(false);
    navigate('/start');
  };

  if (!demo) return <Wallet demo={setDemo} />;

  return (
    <>
      <div className='main-container'>
        <Amount />
        <div className='copyBox mintBox'>
          <label>Test Token CA:</label>
          <h2 className='displayKey'>rndrizKT3MK1iimdxRdWabcF7Zg7AR5T4nud4EkHBof</h2>
          <SlCopyButton value='rndrizKT3MK1iimdxRdWabcF7Zg7AR5T4nud4EkHBof' />
        </div>
        <div className='trade-form'>
          <div>
            <button
              className='logout-btn LogoutBtn float-end demo-button reset-demo'
              onClick={clearStorage}
            >
              RESET DEMO
            </button>
            <h2 className='trade-settings'>Trade Settings</h2>
            <DemoTradeForm />
          </div>
          <OwnedTokens />
        </div>
      </div>
    </>
  );
}
