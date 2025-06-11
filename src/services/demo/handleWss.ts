import type { TokenSetter } from '../../utils/constants';

export const handleDemoMessage = async (event: MessageEvent, setTokens: TokenSetter) => {
  const newToken = JSON.parse(event.data);

  console.log(newToken);
  if (newToken.simulation || newToken.removed) {
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
