import {
  PublicKey,
  type Cluster,
  type VersionedTransaction,
} from '@solana/web3.js';
import * as bs58 from 'bs58';
import type { FrameTransactionResponse, TokenType } from '../types';
import {
  doSPLReceive,
  doSPLSend,
  doSolanaReceive,
  doSolanaSend,
} from './solana';

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
  return (process.env.SOLANA_CLUSTER || 'devnet') as Cluster;
};

export const getChainId = () => {
  return process.env.SOLANA_CHAIN_ID || 'solana:103';
};

export const handleReceiveTransaction = async (
  userAddress: string,
  amount: number,
  tokenType: TokenType,
  cluster: Cluster,
  chainId: string,
) => {
  console.log(
    'create-receive-transaction',
    cluster,
    chainId,
    userAddress,
    amount,
    tokenType,
  );
  const userAddressPubkey = new PublicKey(userAddress);
  const wifTokenPubkey = new PublicKey(
    'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm',
  );
  const isSPL = tokenType !== 'SOL';

  // TODO (JM): WIF : test on devnet
  const transferResponse = isSPL
    ? await doSPLReceive(cluster, amount, userAddressPubkey, wifTokenPubkey)
    : await doSolanaReceive(cluster, amount, userAddressPubkey);

  if (!transferResponse) {
    throw new Error('Invalid transaction');
  }

  return createTransactionResponse(chainId, transferResponse);
};

export const handleSendTransaction = async (
  stateAddress: string,
  userAddress: string,
  amount: number,
  tokenType: TokenType,
  cluster: Cluster,
  chainId: string,
  legacy?: boolean, // TODO: Solve this with Chandra
) => {
  console.log(
    'create-send-transaction',
    cluster,
    chainId,
    stateAddress,
    userAddress,
    amount,
    tokenType,
    legacy,
  );
  const stateAddressPubkey = stateAddress
    ? new PublicKey(stateAddress)
    : undefined;
  const userAddressPubkey = new PublicKey(userAddress);
  const wifTokenPubkey = new PublicKey(
    'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm',
  );
  const isSPL = tokenType !== 'SOL';

  // TODO (JM): WIF : test on devnet
  const transferResponse = isSPL
    ? await doSPLSend(
        cluster,
        amount,
        userAddressPubkey,
        stateAddressPubkey!,
        wifTokenPubkey,
      )
    : await doSolanaSend(
        cluster,
        amount,
        userAddressPubkey,
        stateAddressPubkey!,
      );

  if (!transferResponse) {
    throw new Error('Invalid transaction');
  }

  return createTransactionResponse(chainId, transferResponse);
};
