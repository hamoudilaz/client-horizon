import type { Token, TokenSetter, stateChangeBool } from '../../utils/constants';

export const fetchTokens = async (setTokens: TokenSetter): Promise<void> => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/demo/tokens`);
    const data: Token[] = await res.json();

    console.log(data);

    if (!data) return;
    setTokens(data);
  } catch (error) {
    console.error('Failed to fetch tokens:', error);
  }
};

export const mockUpdateBalance = async (setIsLoading: stateChangeBool) => {
  setIsLoading(true);
  setTimeout(() => setIsLoading(false), 2000);
};

export const checkDemo = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/session/demo`, {
      method: 'GET',
      credentials: 'include',
    });
    const data = await res.json();
    return data;
  } catch (err) {
    return err;
  }
};

export const getSessionAmount = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/session/demo/state`, {
      method: 'GET',
      credentials: 'include',
    });
    const data = await res.json();
    return data;
  } catch (err) {
    return err;
  }
};
