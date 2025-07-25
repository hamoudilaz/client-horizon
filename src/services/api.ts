import type { Token, TokenSetter, stateChangeBool } from '../utils/constants';

export const fetchTokens = async (setTokens: TokenSetter): Promise<void> => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tokens`, {
      method: 'GET',
      credentials: 'include',
    });
    const data: Token[] = await res.json();

    console.log(data);

    if (!data) return;
    setTokens(data);
  } catch (error) {
    console.error('Failed to fetch tokens:', error);
  }
};

export const updateBalance = async (setIsLoading: stateChangeBool) => {
  setIsLoading(true);
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/balance`, {
    method: 'GET',
    credentials: 'include',
  });

  const data = await res.json();
  console.log(data);
  if (!data || data.error) {
    return console.error('Error fetching price');
  }
  return data.portfolio;
};

export const updateSingleTokenBalance = async (
  setIsLoading: stateChangeBool,
  tokenMint: string,
  tokenBalance: number
) => {
  setIsLoading(true);
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/single/balance`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tokenMint: tokenMint,
      tokenBalance: tokenBalance,
    }),
  });

  const data = await res.json();
  if (!data || data.error) {
    return console.error('Error fetching price');
  }
  return Number(data.usdValue);
};
