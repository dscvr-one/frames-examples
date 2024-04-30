import type { State, TransactionAction } from '@/src/types';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  isDscvrFrameMessage,
  UnknownFrameRequest,
  validateDscvrFrameMessage,
} from '@dscvr-one/frames-adapter';
import { dscvrApiUrl } from '@/src/api/dscvr';
import {
  getCluster,
  getChainId,
  handleSendTransaction,
} from '@/src/api/transaction';

const getState = (req: NextRequest) => {
  const url = new URL(req.url);
  const frameStateStr = url.searchParams.get('s');
  if (frameStateStr) {
    const frameState: State = JSON.parse(frameStateStr);
    return frameState;
  }

  return undefined;
};

export async function POST(req: NextRequest) {
  try {
    const state = getState(req);

    if (!state) {
      throw new Error('Invalid state');
    }

    const postBody: UnknownFrameRequest = await req.json();
    if (!postBody || !isDscvrFrameMessage(postBody)) {
      throw new Error('This is not a DSCVR Frame');
    }

    const frameMessage = await validateDscvrFrameMessage(postBody, dscvrApiUrl);

    const userAddress = frameMessage.address;
    if (!state.address || !state.amount || !state.tokenType || !userAddress) {
      throw new Error('Invalid transaction');
    }
    const action: TransactionAction =
      frameMessage.buttonIndex === 1 ? 'send' : 'send_legacy';

    const response = await handleSendTransaction(
      state.address!,
      userAddress,
      state.amount,
      state.tokenType,
      getCluster(),
      getChainId(),
      action === 'send_legacy',
    );
    return NextResponse.json(response);
  } catch (e) {
    console.log('Transaction error:', e);
    return NextResponse.error();
  }
}
