export type Step = 'intro' | 'source' | 'target' | 'amount' | 'swap' | 'result';
export type actions = 'select' | 'next' | 'prev';
export type TokenType = string;

export type State = {
  step?: Step;
  page: number;
  actions?: actions[];
  srcTkn?: TokenType;
  trgtTkn?: TokenType;
  amount?: number;
};

export type Token = {
  type: TokenType;
  name: string;
  icon: string;
  decimals: number;
  mintAddress: string;
};

export type FrameSolanaSendTransactionParams = {
  tx: string;
};

export type FrameTransactionResponse = {
  chainId: string;
  method: string | null;
  params: FrameSolanaSendTransactionParams;
};

export type JupiterToken = {
  address: string;
  chainId: number;
  decimals: number;
  name: string;
  symbol: string;
  logoURI: string;
  tags?: string[];
  extensions?: { [key: string]: string };
};

export type JupiterError = {
  errorCode: string;
  error: string;
};

export type JupiterQuoteResponse =
  | JupiterError
  | {
      inputMint: string;
      inAmount: string;
      outputMint: string;
      outAmount: string;
      otherAmountThreshold: string;
      swapMode: string;
      slippageBps: number;
      platformFee: null;
      priceImpactPct: string;
      routePlan: { swapInfo: any; percent: number }[];
      contextSlot: number;
      timeTaken: number;
    };

export type JupiterSwapResponse =
  | JupiterError
  | {
      swapTransaction: string;
      lastValidBlockHeight: number;
      prioritizationFeeLamports: number;
    };
