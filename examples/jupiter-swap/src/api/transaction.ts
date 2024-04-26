import * as bs58 from 'bs58';
import type { FrameTransactionResponse, TokenType } from '../types';
import { swap } from './jupiter';
import {
  PublicKey,
  type Cluster,
  type VersionedTransaction,
} from '@solana/web3.js';

const createTransactionResponse = (
  chainId: string,
  transaction: VersionedTransaction,
): FrameTransactionResponse => {
  return {
    chainId,
    method: null,
    params: {
      tx: bs58.encode(transaction.serialize()),
    },
  };
};

export const getCluster = () => {
  const chainID = getChainId();
  return (chainID === 'solana:101' ? 'mainnet-beta' : 'devnet') as Cluster;
};

export const getChainId = () => {
  return process.env.SOLANA_CHAIN_ID || 'solana:103';
};

export const handleSwapTransaction = async (
  userAddress: string,
  srcTkn: TokenType,
  trgtTkn: TokenType,
  amount: number,
  chainId: string,
) => {
  console.log(
    'create-swap-transaction',
    chainId,
    userAddress,
    srcTkn,
    trgtTkn,
    amount,
  );

  const userAddressPublicKey = new PublicKey(userAddress);
  const swapTransaction = await swap(
    userAddressPublicKey,
    srcTkn,
    trgtTkn,
    amount,
  );

  if (!swapTransaction) {
    throw new Error('Invalid transaction');
  }

  return createTransactionResponse(chainId, swapTransaction);
};
