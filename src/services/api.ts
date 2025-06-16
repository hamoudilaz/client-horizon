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
  await fetch(`${import.meta.env.VITE_API_URL}/api/balance`, {
    method: 'GET',
    credentials: 'include',
  });
  setTimeout(() => setIsLoading(false), 1000);
};
