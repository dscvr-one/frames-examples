import type { State } from '@/src/types';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  isDscvrFrameMessage,
  UnknownFrameRequest,
  validateDscvrFrameMessage,
} from '@dscvr-one/frames-adapter';
import { dscvrApiUrl } from '@/src/api/dscvr';
import { getChainId, handleSwapTransaction } from '@/src/api/transaction';

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
    if (!state.srcTkn || !state.amount || !state.trgtTkn || !userAddress) {
      throw new Error('Invalid transaction');
    }

    const response = await handleSwapTransaction(
      userAddress,
      state.srcTkn,
      state.trgtTkn,
      state.amount,
      getChainId(),
    );
    return NextResponse.json(response);
  } catch (e) {
    console.log('Transaction error:', e);
    return NextResponse.error();
  }
}
