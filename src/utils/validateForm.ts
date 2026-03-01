import type { settings } from './constants';
export default function validateInput(
  config: settings,
  wsol: number,
  mode: boolean,
  demo: boolean
): true | string {
  if (config.slippage <= 0.01 || config.slippage > 100) {
    return 'Slippage must be between 0.01% and 100%';
  }
  if (config.jitoFee > 0.01) {
    return 'Fee can maximum be 0.01';
  }

  if (config.mint.length < 43 || config.mint.length > 44) {
    return 'Invalid contract address';
  }

  if (config.buyAmount && demo) {
    if (config.buyAmount <= 0 || config.buyAmount >= 5000) {
      return 'Amount must be between 0 and 5000';
    }
    if (config.buyAmount >= wsol) {
      return `You dont have enough wSOL: buy amount: ${config.buyAmount}, owned: ${wsol}`;
    }
  }

  if (mode && !demo) {
    if (config.buyAmount <= 0 || config.buyAmount >= 5) {
      return 'Amount must be between 0 and 5';
    }
    if (config.buyAmount >= wsol) {
      return `You dont have enough wSOL: buy amount: ${config.buyAmount}, owned: ${wsol}`;
    }
  } else if (!demo) {
    if (
      !Number.isInteger(config.sellAmount ?? -1) ||
      (config.sellAmount ?? 0) <= 0 ||
      (config.sellAmount ?? 0) > 100
    ) {
      return 'Amount must be a whole number between 1 and 100';
    }
  }

  return true;
}

export function validateInputSell(config: settings): true | string {
  if (config.slippage <= 0.01) {
    return 'Slippage must be greater than 0.01';
  }
  if (config.jitoFee > 0.01) {
    return 'Fee can maximum be 0.01';
  }

  if (config.mint.length < 43 || config.mint.length > 44) {
    return 'Invalid contract address';
  }

  if (
    !Number.isInteger(config.sellAmount ?? -1) ||
    (config.sellAmount ?? 0) <= 0 ||
    (config.sellAmount ?? 0) > 100
  ) {
    return 'Amount must be a whole number between 1 and 100';
  }

  return true;
}
