import type { settings } from '../utils/constants';

export async function sellToken(config: settings) {
  console.log(config);
  const response = await fetch(`${import.meta.env.VITE_API_URL}/sell`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      outputMint: config.mint,
      amount: config.amount,
      fee: config.fee,
      jitoFee: config.jitoFee,
      node: config.node,
      slippage: config.slippage,
    }),
  });
  const data = await response.json();
  return data;
}
