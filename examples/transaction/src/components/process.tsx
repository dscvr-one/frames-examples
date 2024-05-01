import type { PreviousFrame } from 'frames.js/next/types';
import type { State } from '../types';
import { FrameButton, FrameContainer, FrameImage } from 'frames.js/next/server';
import { getCluster } from '../api/transaction';

export default async function Process({
  previousFrame,
  state,
}: {
  previousFrame: PreviousFrame<State>;
  state: State;
  username: string;
}) {
  const newState: State = { ...state, step: 'process' };
  const stateJson = JSON.stringify(newState);
  const transactionUrl = `/frames/tx?s=${stateJson}`;
  const resultUrl = `/frames?s=${stateJson}`;
  const amountStr = state.amount?.toFixed(10).replace(/0+$/, '');

  return (
    <FrameContainer
      postUrl="/frames"
      pathname="/"
      state={newState}
      previousFrame={previousFrame}
    >
      <FrameImage>
        <div tw="w-full h-full bg-slate-700 text-white justify-center items-center flex flex-col p-20">
          <span>
            You are about to transact {`${amountStr} ${state.tokenType}`} with
            the address {state.address} and a wallet of your choice
          </span>
          <span>Cluster: {getCluster()}</span>
        </div>
      </FrameImage>
      <FrameButton action="tx" target={transactionUrl} post_url={resultUrl}>
        Send
      </FrameButton>
    </FrameContainer>
  );
}
