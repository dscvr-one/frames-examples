import {
  FrameContainer,
  FrameImage,
  FrameButton,
  useFramesReducer,
  getPreviousFrame,
  type NextServerPageProps,
} from 'frames.js/next/server';
import {
  isDscvrFrameMessage,
  validateDscvrFrameMessage,
} from '@dscvr-one/frames-adapter';
import { dscvrApiUrl, getData } from '../api/dscvr';

export default async function Page(props: NextServerPageProps) {
  const previousFrame = getPreviousFrame(props.searchParams);
  const [state] = useFramesReducer((state) => state, {}, previousFrame);

  if (previousFrame.postBody && isDscvrFrameMessage(previousFrame.postBody)) {
    try {
      const frameMessage = await validateDscvrFrameMessage(
        previousFrame.postBody,
        dscvrApiUrl,
      );

      const data = await getData(frameMessage.dscvrId, frameMessage.contentId);

      return (
        <FrameContainer
          postUrl="/frames"
          pathname="/"
          state={{}}
          previousFrame={previousFrame}
        >
          <FrameImage>
            {data?.user && (
              <div tw="flex flex-col items-start max-w-3xl">
                <span tw="text-5xl mb-6">Congratulations:</span>
                {data.user.iconUrl && (
                  <img
                    width={100}
                    height={100}
                    src={data.user.iconUrl}
                    alt="Image"
                  />
                )}
                <span>Username: {data.user.username}</span>
                <span>Bio: {data.user.bio}</span>
                <span>Followers: {data.user.numFollowers}</span>
                <span>Following: {data.user.numFollowing}</span>
                <span>Posts: {data.user.numPosts}</span>
                <span>Active Streak: {data.user.activeStreak}</span>
                {data.content && (
                  <span>Content Owner: {data.content.owner?.username}</span>
                )}
              </div>
            )}
          </FrameImage>
          <FrameButton>Refresh</FrameButton>
        </FrameContainer>
      );
    } catch (e) {
      const error = e as Error;
      console.log('error', error);
      return (
        <FrameContainer
          postUrl="/frames"
          pathname="/"
          state={{}}
          previousFrame={previousFrame}
        >
          <FrameImage>
            <div tw="w-full h-full bg-red-700 text-white justify-center items-center flex flex-col p-20">
              <span>{error.message}</span>
              <span tw="text-xs">{error.stack}</span>
            </div>
          </FrameImage>
          <FrameButton>Refresh</FrameButton>
        </FrameContainer>
      );
    }
  } else if (previousFrame.postBody) {
    return (
      <FrameContainer
        postUrl="/frames"
        pathname="/"
        state={{}}
        previousFrame={previousFrame}
      >
        <FrameImage>
          <div tw="w-full h-full bg-red-700 text-white justify-center items-center flex flex-col p-20">
            <span>This is not a DSCVR source</span>
            <span tw="text-sm">
              {JSON.stringify({
                ...previousFrame.postBody,
                trustedData: undefined,
              })}
            </span>
          </div>
        </FrameImage>
        <FrameButton>Refresh</FrameButton>
      </FrameContainer>
    );
  }

  return (
    <FrameContainer
      postUrl="/frames"
      pathname="/"
      state={state}
      previousFrame={previousFrame}
    >
      <FrameImage>
        <div tw="w-full h-full bg-slate-700 text-white justify-center items-center flex">
          <span>Getting started</span>
        </div>
      </FrameImage>
      <FrameButton>Go</FrameButton>
    </FrameContainer>
  );
}
