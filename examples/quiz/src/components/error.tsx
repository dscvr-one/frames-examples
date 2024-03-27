import {
  FrameContainer,
  FrameImage,
  type PreviousFrame,
} from 'frames.js/next/server';

export default function Error({
  previousFrame,
  message,
  detail,
}: {
  previousFrame: PreviousFrame;
  message: string;
  detail?: string;
}) {
  return (
    <>
      <h1>{message}</h1>
      <FrameContainer
        postUrl="/frames"
        pathname="/"
        state={{}}
        previousFrame={previousFrame}
      >
        <FrameImage>
          <div tw="w-full h-full bg-red-700 text-white justify-center items-center flex flex-col p-20">
            <span>{message}</span>
            {detail ? <span tw="text-xs">{detail}</span> : null}
          </div>
        </FrameImage>
      </FrameContainer>
    </>
  );
}
