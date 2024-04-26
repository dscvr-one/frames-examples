import type { PreviousFrame } from 'frames.js/next/types';
import type { State } from '../types';
import {
  FrameButton,
  FrameContainer,
  FrameImage,
  FrameInput,
} from 'frames.js/next/server';
import { getToken } from '../api/jupiter';

export default async function Amount({
  previousFrame,
  state,
  username,
  warning,
}: {
  previousFrame: PreviousFrame<State>;
  state: State;
  username: string;
  warning?: string;
}) {
  const srcTkn = await getToken(state.srcTkn);
  return (
    <FrameContainer
      postUrl="/frames"
      pathname="/"
      state={{ ...state, step: 'amount' }}
      previousFrame={previousFrame}
    >
      <FrameImage>
        <div tw="w-full h-full bg-slate-700 text-white justify-center items-center flex flex-col p-20">
          <span tw="text-5xl mb-6">Hi, {username}</span>
          {warning ? <span tw="text-red-500">{warning}</span> : null}
          <span>Type the amount of {srcTkn?.name} for the swap</span>
        </div>
      </FrameImage>
      <FrameInput text="Type a valid amount" />
      <FrameButton>Select</FrameButton>
    </FrameContainer>
  );
}
