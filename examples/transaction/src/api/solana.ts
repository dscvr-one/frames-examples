import {
  Connection,
  Keypair,
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

export const receiveSourceAddress =
  'frmWfKei9iH92NEWC7TYNpqTYTMreKFNQivGqS3UBCX';

//This will prompt the user to transfer $WIF token from their wallet to a wallet
export const doSPLSend = async (
  cluster: Cluster,
  amount: number,
  fromPubKey: PublicKey,
  toPubKey: PublicKey,
  splTokenKey: PublicKey,
) => {
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
      amount, //amount
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

//this will prompt the user to transfer SOL from their wallet to a wallet
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

//this is common, backend account will partially sign transaction but make the fee payer the receiver
export const doSPLReceive = async (
  cluster: Cluster,
  amount: number,
  toPubKey: PublicKey,
  splTokenKey: PublicKey,
) => {
  const framePrivateKey = [
    112, 145, 128, 10, 226, 103, 187, 236, 71, 66, 152, 174, 197, 204, 161, 239,
    255, 130, 203, 78, 69, 255, 45, 183, 18, 32, 148, 68, 163, 171, 234, 223, 9,
    244, 87, 204, 161, 73, 125, 222, 114, 163, 226, 122, 175, 0, 148, 31, 153,
    104, 144, 222, 2, 138, 215, 246, 224, 198, 129, 177, 241, 250, 107, 124,
  ];
  let keypair = Keypair.fromSecretKey(Uint8Array.from(framePrivateKey));
  //key address: frmWfKei9iH92NEWC7TYNpqTYTMreKFNQivGqS3UBCX
  const connection = new Connection(clusterApiUrl(cluster));

  const splToken = splTokenKey;

  const sender = keypair.publicKey;
  const receiver = toPubKey;

  const transaction = new Transaction();

  const mint = await getMint(connection, splToken);

  const senderAta = await getAssociatedTokenAddress(
    mint.address, // token
    sender, // owner
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
        receiver,
        receiverAta,
        receiver,
        mint.address,
      ),
    );
  }

  const blockHash = (await connection.getLatestBlockhash('finalized'))
    .blockhash;

  const transferInstruction = createTransferCheckedInstruction(
    senderAta, // from
    mint.address, // token mint address
    receiverAta, // to
    sender, // from's owner
    amount, //amount
    mint.decimals, // decimals
  );

  const transferTransaction = new Transaction();
  transferTransaction.add(transferInstruction);

  transaction.add(transferTransaction);

  const messageV0 = new TransactionMessage({
    payerKey: receiver, // the receiver is the payer
    recentBlockhash: blockHash,
    instructions: transaction.instructions,
  }).compileToV0Message();

  const versionedTx = new VersionedTransaction(messageV0);
  versionedTx.sign([keypair]);
  return versionedTx;
};

export const doSolanaReceive = async (
  cluster: Cluster,
  amount: number,
  toPubKey: PublicKey,
) => {
  console.log('doSolanaReceive', cluster, amount, toPubKey);
  throw new Error('Not implemented');
};
