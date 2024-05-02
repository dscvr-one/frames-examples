import type { PreviousFrame } from 'frames.js/next/types';
import type { State } from '../types';
import {
  FrameButton,
  FrameContainer,
  FrameImage,
  FrameInput,
} from 'frames.js/next/server';

export default async function Address({
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
  return (
    <FrameContainer
      postUrl="/frames"
      pathname="/"
      state={{ ...state, step: 'address' }}
      previousFrame={previousFrame}
    >
      <FrameImage>
        <div tw="w-full h-full bg-slate-700 text-white justify-center items-center flex flex-col p-20">
          <span tw="text-5xl mb-6">Hi, {username}</span>
          {warning ? (
            <span tw="text-red-500">{warning}</span>
          ) : (
            <span>
              Please type a valid address to send/receive the transaction
            </span>
          )}
        </div>
      </FrameImage>
      <FrameInput text="Type a valid address" />
      <FrameButton>Set Address</FrameButton>
    </FrameContainer>
  );
}
