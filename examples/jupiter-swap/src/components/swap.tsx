import type { PreviousFrame } from 'frames.js/next/types';
import { headers } from 'next/headers';
import type { State } from '../types';
import { FrameButton, FrameContainer, FrameImage } from 'frames.js/next/server';
import { getChainId } from '../api/transaction';
import { getToken } from '../api/jupiter';

export default async function Process({
  previousFrame,
  state,
}: {
  previousFrame: PreviousFrame<State>;
  state: State;
  username: string;
}) {
  const headersList = headers();
  const origin =
    typeof window !== 'undefined'
      ? window.location.origin
      : `${headersList.get('x-forwarded-proto')}://${headersList.get('x-forwarded-host')}` ??
        '';
  const srcTkn = await getToken(state.srcTkn);
  const trgtTkn = await getToken(state.trgtTkn);
  const newState: State = { ...state, step: 'swap' };
  const stateJson = JSON.stringify(newState);
  const transactionUrl = `/frames/tx?s=${stateJson}`;
  // frames.js, does not resolve post_url the same way it solves for target
  const resultUrl = `${origin}/frames?s=${stateJson}`;
  const amountStr = state.amount?.toFixed(10).replace(/0+$/, '');

  return (
    <FrameContainer
      postUrl="/frames"
      pathname="/"
      state={{ ...state, step: 'swap' }}
      previousFrame={previousFrame}
    >
      <FrameImage>
        <div tw="w-full h-full bg-slate-700 text-white justify-center items-center flex flex-col p-20">
          <span>
            You are about to swap {amountStr} {srcTkn?.name} to {trgtTkn?.name}{' '}
            using a wallet of your choice
          </span>
          <span>Cluster: {getChainId()}</span>
        </div>
      </FrameImage>
      <FrameButton action="tx" target={transactionUrl} post_url={resultUrl}>
        Swap
      </FrameButton>
    </FrameContainer>
  );
}
