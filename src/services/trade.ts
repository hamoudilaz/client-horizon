import type {
  settings,
  SwapResponse,
  SellResponse,
  TokenSetter,
  Token,
  limitArgs,
} from '../utils/constants';

const API_BASE = import.meta.env.VITE_API_URL || '';

// Rate limit helper for production
export const rateLimit: limitArgs = (setLimit, setError, retrySeconds) => {
  setLimit(true);
  let secondsLeft = retrySeconds;

  const interval = setInterval(() => {
    secondsLeft--;
    setError(`Rate limit exceeded. Retry in ${secondsLeft}s.`);

    if (secondsLeft <= 0) {
      clearInterval(interval);
      setLimit(false);
      setError('');
    }
  }, 1000);
};

type TradeEndpoint = 'swap' | 'demo';

export function createTradeServices(endpoint: TradeEndpoint) {
  const basePath = endpoint === 'demo' ? '/api/demo' : '/api/swap';
  const tokensPath = endpoint === 'demo' ? '/api/demo/tokens' : '/api/tokens';

  const executeSwap = async (params: settings): Promise<SwapResponse> => {
    console.log(params);
    try {
      const sendReq = await fetch(`${API_BASE}${basePath}/buy`, {
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
  };

  const sellToken = async (config: settings): Promise<SellResponse> => {
    console.log(config);
    const response = await fetch(`${API_BASE}${basePath}/sell`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        outputMint: config.mint,
        amount: config.sellAmount,
        fee: config.fee,
        jitoFee: config.jitoFee,
        node: config.node,
        slippage: config.slippage,
      }),
    });
    const data = await response.json();
    return data;
  };

  const fetchTokens = async (setTokens: TokenSetter): Promise<void> => {
    try {
      const res = await fetch(`${API_BASE}${tokensPath}`, {
        method: 'GET',
        credentials: 'include',
      });
      const data: Token[] = await res.json();

      console.log(data);

      if (Array.isArray(data)) {
        setTokens(data);
      } else {
        console.error('API did not return an array of tokens:', data);
        setTokens([]);
      }
    } catch (error) {
      console.error('Failed to fetch tokens:', error);
      setTokens([]);
    }
  };

  return { executeSwap, sellToken, fetchTokens };
}

// Pre-built instances for convenience
export const prodServices = createTradeServices('swap');
export const demoServices = createTradeServices('demo');
