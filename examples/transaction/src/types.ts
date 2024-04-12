export type Step = 'intro' | 'address' | 'amount' | 'process' | 'result';
export type TokenType = 'SOL' | 'WIF';
export type TransactionAction = 'send' | 'send_legacy';
export type State = {
  step?: Step;
  address?: string;
  amount?: number;
  tokenType?: TokenType;
};

export type FrameSolanaSendTransactionParams = {
  tx: string;
};

export type FrameTransactionResponse = {
  chainId: string;
  method: string | null;
  params: FrameSolanaSendTransactionParams;
};
