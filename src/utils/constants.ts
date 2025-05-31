export type settings = {
  mint: string;
  amount: number;
  slippage: number;
  fee: number;
  jitoFee: number;
  node: boolean;
};

export type InputEvent = React.ChangeEvent<HTMLInputElement>;
export type TokenSetter = React.Dispatch<React.SetStateAction<Token[]>>;

export type stateChangeBool = React.Dispatch<React.SetStateAction<boolean>>;
export type singleMode = React.Dispatch<React.SetStateAction<settings>>;

export type limitArgs = (
  setLimit: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string>>,
  retrySeconds: number
) => void;

export type Mode = {
  curr: boolean;
  mode: React.Dispatch<React.SetStateAction<settings>>;
};

export type SwapResponse = {
  error?: string;
  message?: string;
  status?: string | number;
  details?: string;
  limit?: boolean;
  retryAfter?: number;
  end?: string;
};

export type ownAmount = {
  usdValue: number;
  SOL: number;
  WSOL: number;
};

export type Token = {
  tokenMint: string;
  tokenBalance: number;
  usdValue: number;
  logoURI: string;
  symbol: string;
};

export type Props = {
  token: Token;
  loadingStates: Record<string, boolean>;
  handleSell: (token: Token, percent: number, node: boolean) => void;
};

export const refreshRef: { current: (() => Promise<void>) | null } = { current: null };

export const solMint = 'So11111111111111111111111111111111111111112';
