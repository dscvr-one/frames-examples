import type { PreviousFrame } from 'frames.js/next/types';
import type { State } from '../types';
import { FrameButton, FrameContainer, FrameImage } from 'frames.js/next/server';

export default async function Error({
  previousFrame,
  state,
  error,
}: {
  previousFrame: PreviousFrame<State>;
  state: State;
  error: Error;
}) {
  return (
    <FrameContainer
      postUrl="/frames"
      pathname="/"
      state={state}
      previousFrame={previousFrame}
    >
      <FrameImage>
        <div tw="w-full h-full bg-red-700 text-white justify-center items-center flex flex-col p-20">
          <span>{error.message}</span>
        </div>
      </FrameImage>
      <FrameButton>Refresh</FrameButton>
    </FrameContainer>
  );
}
