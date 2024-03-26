'use server';

import fs from 'fs';
import path from 'path';
import { headers } from 'next/headers';
import {
  FrameContainer,
  FrameImage,
  FrameButton,
  useFramesReducer,
  getPreviousFrame,
  type NextServerPageProps,
} from 'frames.js/next/server';

type State = {
  index: number;
};

const getCarousel = async () => {
  try {
    const folderPath = path.resolve(process.cwd(), 'public');
    const files = await fs.readdirSync(folderPath);
    return files;
  } catch (e) {
    console.error(e);
    return [];
  }
};

export default async function Page(props: NextServerPageProps) {
  const headersList = headers();
  const previousFrame = getPreviousFrame<State>(props.searchParams);
  const [state] = useFramesReducer<State>(
    (state) => state,
    { index: 0 },
    previousFrame,
  );

  const carouselImages = await getCarousel();
  const origin =
    typeof window !== 'undefined'
      ? window.location.origin
      : `${headersList.get('x-forwarded-proto')}://${headersList.get('x-forwarded-host')}` ??
        '';

  let index = state.index;
  if (previousFrame.postBody?.untrustedData?.buttonIndex) {
    if (previousFrame.postBody?.untrustedData?.buttonIndex === 1) {
      if (index === 0) {
        index++;
      } else {
        index--;
      }
    } else if (previousFrame.postBody?.untrustedData?.buttonIndex === 2) {
      index++;
    }
  }

  const src = `${origin}/${carouselImages[index]}`;

  return (
    <FrameContainer
      postUrl="/frames"
      pathname="/"
      state={{ ...state, index }}
      previousFrame={previousFrame}
    >
      <FrameImage src={src} />
      {index > 0 ? <FrameButton>← Back</FrameButton> : null}
      {index < carouselImages.length - 1 ? (
        <FrameButton>Next →</FrameButton>
      ) : null}
    </FrameContainer>
  );
}
