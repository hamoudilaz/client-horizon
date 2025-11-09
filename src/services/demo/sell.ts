import type { settings } from '../../utils/constants';

const API_BASE = import.meta.env.VITE_API_URL || '';

export async function sellToken(config: settings) {
  console.log(config);
  const response = await fetch(`${API_BASE}/api/demo/sell`, {
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
}
