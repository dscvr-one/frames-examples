import type { TokenType } from '../types';
import { getTransactionDetails } from './jupiter';
import { getCluster } from './transaction';

export const handleTransactionResult = async (
  userAddress: string,
  transactionId: string,
  sourceType: TokenType,
  targetType: TokenType,
  amount: number,
) => {
  const cluster = getCluster();

  console.log(
    'Success',
    userAddress,
    transactionId,
    sourceType,
    targetType,
    amount,
  );

  const details = await getTransactionDetails(cluster, transactionId);
  if (!details) {
    throw new Error('Invalid transaction details');
  }
  console.log('details', details);
};
