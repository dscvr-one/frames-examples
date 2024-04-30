import {
  PublicKey,
  type Cluster,
  type VersionedTransaction,
} from '@solana/web3.js';
import * as bs58 from 'bs58';
import type { FrameTransactionResponse, TokenType } from '../types';
import { doSPLSend, doSolanaSend } from './solana';

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

export const handleSendTransaction = async (
  stateAddress: string,
  userAddress: string,
  amount: number,
  tokenType: TokenType,
  cluster: Cluster,
  chainId: string,
  legacy?: boolean,
) => {
  // TODO: Solve this with Chandra
  console.log('legacy', legacy);
  const stateAddressPubkey = stateAddress
    ? new PublicKey(stateAddress)
    : undefined;
  const userAddressPubkey = new PublicKey(userAddress);
  const wifTokenPubkey = new PublicKey(
    'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm',
  );
  const isSPL = tokenType !== 'SOL';

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
