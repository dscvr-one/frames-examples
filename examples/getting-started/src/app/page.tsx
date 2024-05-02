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
          state={state}
          previousFrame={previousFrame}
        >
          <FrameImage>
            {data?.user && (
              <div tw="w-full h-full bg-slate-700 text-white justify-between items-start flex flex-col p-20 text-3xl">
                <span tw="text-5xl mb-6">Hi, {data.user.username}</span>
                <span>
                  You have {data.user.followerCount} followers, and you are
                  following {data.user.followingCount} users.
                </span>
                <span>You have created {data.user.postCount} posts</span>
                <span>
                  You have logged into DSCVR for {data.user.streak.dayCount}{' '}
                  consecutive days and have earned{' '}
                  {data.user.streak.multiplierCount} multipliers.
                </span>
                {data.content && (
                  <div tw="flex items-start mt-10">
                    {data.content.portal.iconUrl && (
                      <img
                        width={100}
                        height={100}
                        src={data.content.portal.iconUrl}
                        alt="Image"
                        tw="mr-6 "
                      />
                    )}
                    <div tw="flex flex-col ">
                      <span>Post owner: {data.content.creator?.username}</span>
                      {data.content.portal && (
                        <span>Portal {data.content.portal.name}</span>
                      )}
                    </div>
                  </div>
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
          state={state}
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
        state={state}
        previousFrame={previousFrame}
      >
        <FrameImage>
          <div tw="w-full h-full bg-red-700 text-white justify-center items-center flex flex-col p-20">
            <span>You are not in DSCVR</span>
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
        <div tw="w-full h-full bg-slate-700 text-white justify-center items-center flex p-20">
          <span>
            This a “hello world” frames example that will use DSCVR’s Open API
            to show your profile info
          </span>
        </div>
      </FrameImage>
      <FrameButton>About Me</FrameButton>
    </FrameContainer>
  );
}
