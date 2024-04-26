import {
  type PublicKey,
  VersionedTransaction,
  type Cluster,
  clusterApiUrl,
  Connection,
} from '@solana/web3.js';
import type {
  JupiterQuoteResponse,
  JupiterSwapResponse,
  JupiterToken,
  Token,
  TokenType,
} from '../types';

const getApiUrl = () => {
  const url = process.env.JUPITER_API_URL;
  if (!url) {
    throw new Error('JUPITER_API_URL is not set');
  }
  return url;
};

const getTokenListEndpoint = () => {
  return (
    process.env.JUPITER_TOKEN_LIST_ENDPOINT || 'https://token.jup.ag/strict'
  );
};

export const getTransactionDetails = (
  cluster: Cluster,
  transactionId: string,
) => {
  const connection = new Connection(clusterApiUrl(cluster));
  return connection.getParsedTransaction(transactionId, {
    commitment: 'confirmed',
    maxSupportedTransactionVersion: 0,
  });
};

let singletonTokenList: Token[] = [];
export const getTokenList = async (): Promise<Token[]> => {
  if (singletonTokenList.length) {
    singletonTokenList;
  }
  const endpointUrl = getTokenListEndpoint();
  const tokenList: JupiterToken[] = await fetch(endpointUrl).then((response) =>
    response.json(),
  );
  singletonTokenList = tokenList.map((token) => ({
    type: token.symbol,
    name: token.name,
    icon: token.logoURI,
    mintAddress: token.address,
    decimals: token.decimals,
  }));
  return singletonTokenList;
};

export const getToken = async (
  token?: TokenType,
): Promise<Token | undefined> => {
  const list = await getTokenList();
  return list.find((t) => t.type === token);
};

export const quote = async (
  sourceTokenType: TokenType,
  targetTokenType: TokenType,
  amount: number,
) => {
  const sourceToken = await getToken(sourceTokenType);
  const targetToken = await getToken(targetTokenType);
  if (!sourceToken || !targetToken) {
    throw new Error('Invalid tokens');
  }
  const newAmount = amount * 10 ** sourceToken?.decimals;
  const apiUrl = getApiUrl();
  const quoteUrl = `${apiUrl}/quote?inputMint=${sourceToken.mintAddress}&outputMint=${targetToken.mintAddress}&amount=${newAmount}`;
  const quoteResponse: JupiterQuoteResponse = await fetch(quoteUrl).then(
    (response) => response.json(),
  );
  if ('error' in quoteResponse) {
    throw new Error(quoteResponse.error);
  }
  return quoteResponse;
};

export const swap = async (
  userAddressPubkey: PublicKey,
  sourceTokenType: TokenType,
  targetTokenType: TokenType,
  amount: number,
) => {
  const quoteResponse = await quote(sourceTokenType, targetTokenType, amount);
  const apiUrl = getApiUrl();
  const swapUrl = `${apiUrl}/swap`;
  const payload = {
    // quoteResponse from /quote api
    quoteResponse,
    // user public key to be used for the swap
    userPublicKey: userAddressPubkey.toString(),
    // auto wrap and unwrap SOL. default is true
    wrapAndUnwrapSol: true,
    // feeAccount is optional. Use if you want to charge a fee.  feeBps must have been passed in /quote API.
    // feeAccount: "fee_account_public_key"
  };
  const body = JSON.stringify(payload);

  const swapResponse: JupiterSwapResponse = await fetch(swapUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  }).then((response) => response.json());

  if ('error' in swapResponse) {
    throw new Error(swapResponse.error);
  }
  const swapTransactionBuf = Buffer.from(
    swapResponse.swapTransaction,
    'base64',
  );
  return VersionedTransaction.deserialize(swapTransactionBuf);
};
