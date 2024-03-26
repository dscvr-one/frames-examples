import { headers } from 'next/headers';
import {
  FrameContainer,
  FrameImage,
  FrameButton,
  useFramesReducer,
  getPreviousFrame,
  FrameInput,
  type NextServerPageProps,
} from 'frames.js/next/server';

export default async function Page(props: NextServerPageProps) {
  const headersList = headers();
  const previousFrame = getPreviousFrame(props.searchParams);
  const [state] = useFramesReducer((state) => state, {}, previousFrame);

  const origin =
    typeof window !== 'undefined'
      ? window.location.origin
      : `${headersList.get('x-forwarded-proto')}://${headersList.get('x-forwarded-host')}` ??
        '';

  let src = `${origin}/png-sample.png`;
  switch (previousFrame.postBody?.untrustedData.buttonIndex) {
    case 1:
      src = `${origin}/png-sample.png`;
      break;
    case 2:
      src = `${origin}/gif-sample.gif`;
      break;
    case 3:
      src = `${origin}/svg-sample.svg`;
      break;
    case 4:
      if (previousFrame.postBody?.untrustedData.inputText?.trim()) {
        src = previousFrame.postBody?.untrustedData.inputText?.trim() ?? '';
      }
      break;
  }

  return (
    <FrameContainer
      postUrl="/frames"
      pathname="/"
      state={state}
      previousFrame={previousFrame}
    >
      <FrameImage src={src} />
      <FrameInput text="Paste your media url" />
      <FrameButton>PNG</FrameButton>
      <FrameButton>GIF</FrameButton>
      <FrameButton>SVG</FrameButton>
      <FrameButton>Custom</FrameButton>
    </FrameContainer>
  );
}
