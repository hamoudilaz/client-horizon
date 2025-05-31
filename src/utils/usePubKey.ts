import { useContext } from 'react';
import PubKeyContext from '../utils/PubKeyContext';

export function usePubKey() {
  return useContext(PubKeyContext);
}
