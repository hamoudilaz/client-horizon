import type { TokenSetter } from './constants';
import { refreshRef } from './constants';

export const handleMessage = async (event: MessageEvent, setTokens: TokenSetter) => {
  const newToken = JSON.parse(event.data);

  if (newToken.listToken || newToken.removed) {
    refreshRef.current?.();

    if (newToken.removed) {
      setTokens((prevTokens) => prevTokens.filter((t) => t.tokenMint !== newToken.tokenMint));
    } else {
      setTokens((prevTokens) => {
        const existingToken = prevTokens.find((t) => t.tokenMint === newToken.tokenMint);

        if (existingToken) {
          return prevTokens.map((t) => (t.tokenMint === newToken.tokenMint ? newToken : t));
        } else {
          return [...prevTokens, newToken];
        }
      });
    }
  }
};
