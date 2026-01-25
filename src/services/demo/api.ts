import type { stateChangeBool } from '../../utils/constants';

const API_BASE = import.meta.env.VITE_API_URL || '';

// Minimum delay for loading spinner visibility
const MIN_LOADING_DELAY = 500;

export const mockUpdateBalance = async (setIsLoading: stateChangeBool) => {
  setIsLoading(true);
  const startTime = Date.now();
  try {
    const res = await fetch(`${API_BASE}/api/demo/tokens`, {
      method: 'GET',
      credentials: 'include',
    });
    const data = await res.json();

    // Ensure minimum loading time for visual feedback
    const elapsed = Date.now() - startTime;
    if (elapsed < MIN_LOADING_DELAY) {
      await new Promise((resolve) => setTimeout(resolve, MIN_LOADING_DELAY - elapsed));
    }

    return data;
  } catch (err) {
    console.error('Error updating demo balance:', err);
    return [];
  } finally {
    setIsLoading(false);
  }
};

export const checkDemo = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/demo/session`, {
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
    const res = await fetch(`${API_BASE}/api/demo/session/state`, {
      method: 'GET',
      credentials: 'include',
    });
    const data = await res.json();
    return data;
  } catch (err) {
    return err;
  }
};
