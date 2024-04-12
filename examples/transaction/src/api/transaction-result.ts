import type { TokenType, TransactionAction } from '../types';

export const handleTransactionResult = async (
  stateAddress: string,
  userAddress: string,
  amount: number,
  tokenType: TokenType,
  action: TransactionAction,
) => {
  // Do something with this data
  console.log('Success', stateAddress, userAddress, amount, tokenType, action);
};
