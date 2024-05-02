import type { PreviousFrame } from 'frames.js/next/types';
import type { State } from '../types';
import { FrameButton, FrameContainer, FrameImage } from 'frames.js/next/server';
import { getCluster } from '../api/transaction';

export default async function Intro({
  previousFrame,
  state,
}: {
  previousFrame: PreviousFrame<State>;
  state: State;
}) {
  return (
    <FrameContainer
      postUrl="/frames"
      pathname="/"
      state={{ ...state, step: 'intro' }}
      previousFrame={previousFrame}
    >
      <FrameImage>
        <div tw="w-full h-full bg-slate-700 text-white justify-center items-center flex flex-col p-20">
          <span>Solana Transaction</span>
          <span>Cluster: {getCluster()}</span>
        </div>
      </FrameImage>
      <FrameButton>Start</FrameButton>
    </FrameContainer>
  );
}
