import type { TokenType } from '../types';
import { getTransactionDetails } from './solana';
import { getCluster } from './transaction';

export const handleTransactionResult = async (
  userAddress: string, // eslint-disable-line no-unused-vars
  transactionId: string,
  stateAddress: string, // eslint-disable-line no-unused-vars
  amount: number, // eslint-disable-line no-unused-vars
  tokenType: TokenType, // eslint-disable-line no-unused-vars
) => {
  const cluster = getCluster();

  const details = await getTransactionDetails(cluster, transactionId);
  if (!details) {
    throw new Error('Invalid transaction details');
  }
};
