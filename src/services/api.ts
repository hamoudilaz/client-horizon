import type { stateChangeBool } from '../utils/constants';

const API_BASE = import.meta.env.VITE_API_URL || '';

export const updateBalance = async (setIsLoading: stateChangeBool) => {
  setIsLoading(true);
  try {
    const res = await fetch(`${API_BASE}/api/balance`, {
      method: 'GET',
      credentials: 'include',
    });

    const data = await res.json();
    if (!data || data.error) {
      console.error('Error fetching price');
      return;
    }
    return data.portfolio;
  } finally {
    setIsLoading(false);
  }
};

// Minimum delay for loading spinner visibility
const MIN_LOADING_DELAY = 500;

export const updateSingleTokenBalance = async (
  setIsLoading: stateChangeBool,
  tokenMint: string,
  tokenBalance: number
) => {
  setIsLoading(true);
  const startTime = Date.now();
  try {
    const res = await fetch(`${API_BASE}/api/single/balance`, {
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

    // Ensure minimum loading time for visual feedback
    const elapsed = Date.now() - startTime;
    if (elapsed < MIN_LOADING_DELAY) {
      await new Promise((resolve) => setTimeout(resolve, MIN_LOADING_DELAY - elapsed));
    }

    if (!data || data.error) {
      console.error('Error fetching price');
      return;
    }
    return Number(data.usdValue);
  } finally {
    setIsLoading(false);
  }
};

export const cleanWallet = async (isHardCleanup: boolean) => {
  const res = await fetch(`${API_BASE}/api/cleanup`, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({
      isHardCleanup,
    }),
  });

  const data = await res.json();
  if (!data || data.error) {
    console.error('Error cleaning wallet');
    return;
  }
  return data;
};
