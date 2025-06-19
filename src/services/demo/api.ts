import type { Token, TokenSetter, stateChangeBool } from '../../utils/constants';

export const fetchTokens = async (setTokens: TokenSetter): Promise<void> => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/demo/tokens`, {
      method: 'GET',
      credentials: 'include',
    });
    const data: Token[] = await res.json();

    console.log(data);

    if (Array.isArray(data)) {
      setTokens(data);
    } else {
      // If it's not an array, set it to an empty array to prevent the .map error
      // and log the error from the API.
      console.error('API did not return an array of tokens:', data);
      setTokens([]);
    }
  } catch (error) {
    console.error('Failed to fetch tokens:', error);
    setTokens([]);
  }
};

export const mockUpdateBalance = async (setIsLoading: stateChangeBool) => {
  setIsLoading(true);
  setTimeout(() => setIsLoading(false), 20300);
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
