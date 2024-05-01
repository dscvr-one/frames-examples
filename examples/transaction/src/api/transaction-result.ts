import type { TokenType } from '../types';
import { getTransactionDetails } from './solana';
import { getCluster } from './transaction';

export const handleTransactionResult = async (
  userAddress: string,
  transactionId: string,
  stateAddress: string,
  amount: number,
  tokenType: TokenType,
) => {
  const cluster = getCluster();

  console.log(
    'Success',
    userAddress,
    transactionId,
    stateAddress,
    amount,
    tokenType,
  );

  const details = await getTransactionDetails(cluster, transactionId);
  if (!details) {
    throw new Error('Invalid transaction details');
  }
  console.log('details', details);
};
