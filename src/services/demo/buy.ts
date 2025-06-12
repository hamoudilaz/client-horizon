import type { settings, SwapResponse } from '../../utils/constants';

export async function executeSwap(params: settings): Promise<SwapResponse> {
  console.log(params);
  try {
    const sendReq = await fetch(`${import.meta.env.VITE_API_URL}/demo/buy`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    const data = await sendReq.json();

    if (data.limit) {
      const retryAfter = 20;
      return {
        limit: true,
        error: `Rate limit exceeded. Retry in ${retryAfter}s.`,
        retryAfter,
      };
    }

    if (data.error) {
      throw new Error(data.error);
    }

    return data;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unexpected error occurred';
    console.error('Fetch error:', message);
    return { error: message };
  }
}
