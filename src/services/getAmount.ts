import { solMint } from '../utils/constants';

export async function getAmount(pubkey: string) {
  const pair = await (
    await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd')
  ).json();

  console.log(pair);

  const data = await (await fetch(`https://lite-api.jup.ag/ultra/v1/balances/${pubkey}`)).json();
  const sol = data?.SOL?.uiAmount || 0;
  const wsol = data?.[solMint]?.uiAmount || 0;
  const usdValue = ((sol + wsol) * pair.solana.usd).toFixed(2);

  return {
    usdValue: Number(usdValue),
    SOL: Number(sol.toFixed(4)),
    WSOL: Number(wsol.toFixed(4)),
  };
}
