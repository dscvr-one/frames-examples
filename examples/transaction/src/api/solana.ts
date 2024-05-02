import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionMessage,
  VersionedTransaction,
  clusterApiUrl,
  type Cluster,
} from '@solana/web3.js';
import {
  createAssociatedTokenAccountInstruction,
  createTransferCheckedInstruction,
  getAccount,
  getAssociatedTokenAddress,
  getMint,
} from '@solana/spl-token';

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

export const doSPLSend = async (
  cluster: Cluster,
  amount: number,
  fromPubKey: PublicKey,
  toPubKey: PublicKey,
  splTokenKey: PublicKey,
) => {
  if (cluster !== 'mainnet-beta') {
    throw new Error('Only mainnet-beta is supported for SPL tokens');
  }
  const connection = new Connection(clusterApiUrl(cluster));

  const splToken = splTokenKey;

  const payer = fromPubKey;
  const receiver = toPubKey;

  const transaction = new Transaction();

  const mint = await getMint(connection, splToken);

  const payerAta = await getAssociatedTokenAddress(
    mint.address, // token
    payer, // owner
    false,
  );

  const receiverAta = await getAssociatedTokenAddress(
    mint.address, // token
    receiver, // owner
    false,
  );

  try {
    await getAccount(connection, receiverAta);
  } catch (e) {
    // Create ATA on behalf of receiver
    transaction.add(
      createAssociatedTokenAccountInstruction(
        payer,
        receiverAta,
        receiver,
        mint.address,
      ),
    );
  }

  transaction.add(
    createTransferCheckedInstruction(
      payerAta, // from
      mint.address, // mint
      receiverAta, // to
      payer, // from's owner
      amount * 10 ** mint.decimals, //amount
      mint.decimals, // decimals
    ),
  );

  const blockHash = (await connection.getLatestBlockhash('finalized'))
    .blockhash;

  const messageV0 = new TransactionMessage({
    payerKey: fromPubKey,
    recentBlockhash: blockHash,
    instructions: transaction.instructions,
  }).compileToV0Message();

  return new VersionedTransaction(messageV0);
};

export const doSolanaSend = async (
  cluster: Cluster,
  amount: number,
  fromPubKey: PublicKey,
  toPubKey: PublicKey,
) => {
  const connection = new Connection(clusterApiUrl(cluster));
  const blockhash = await connection
    .getLatestBlockhash()
    .then((res) => res.blockhash);

  const tx = new Transaction();

  tx.add(
    SystemProgram.transfer({
      fromPubkey: fromPubKey,
      toPubkey: toPubKey,
      lamports: amount * 10 ** 9,
    }),
  );
  const messageV0 = new TransactionMessage({
    payerKey: fromPubKey,
    recentBlockhash: blockhash,
    instructions: tx.instructions,
  }).compileToV0Message();

  return new VersionedTransaction(messageV0);
};
