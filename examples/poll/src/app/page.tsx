import {
  useFramesReducer,
  getPreviousFrame,
  type NextServerPageProps,
} from 'frames.js/next/server';
import {
  isDscvrFrameMessage,
  validateDscvrFrameMessage,
} from '@dscvr-one/frames-adapter';
import { getFrameMessage } from 'frames.js/next/server';
import type { State, UserSource } from '../types';
import { Error } from '../components/error';
import { Intro } from '../components/intro';
import { Answers } from '../components/answers';
import { Result } from '../components/result';
import {
  getAnswers,
  getExistingVote,
  getQuestion,
  getStats,
  setAnswer,
} from '../api/content';
import { dscvrApiUrl, getData } from '../api/dscvr';

export default async function Page(props: NextServerPageProps) {
  const previousFrame = getPreviousFrame<State>(props.searchParams);
  const [state] = useFramesReducer<State>(
    (state) => state,
    { step: 'intro' },
    previousFrame,
  );

  try {
    if (previousFrame.postBody && state?.step !== 'intro' && state.questionId) {
      const question = await getQuestion(state.questionId);
      const answers = await getAnswers(state.questionId);

      let userId: string | undefined;
      let contentId: string | undefined;
      let username: string | undefined;
      let userSource: UserSource = 'DSCVR';
      let buttonIndex: number | undefined;
      if (isDscvrFrameMessage(previousFrame.postBody)) {
        const frameMessage = await validateDscvrFrameMessage(
          previousFrame.postBody,
          dscvrApiUrl,
        );
        buttonIndex = frameMessage.buttonIndex;
        userId = frameMessage.dscvrId;
        contentId = frameMessage.contentId;

        const user = await getData(userId!);
        username = user?.user?.username;
      } else {
        const frameMessage = await getFrameMessage(previousFrame.postBody);
        if (!frameMessage) {
          return (
            <Error
              previousFrame={previousFrame}
              message="Invalid Farcaster Message"
              detail={JSON.stringify(previousFrame.postBody)}
            />
          );
        }
        buttonIndex = frameMessage.buttonIndex;
        userId = frameMessage.requesterFid.toString();
        userSource = 'Farcaster';
        username = frameMessage.requesterUserData?.username;
      }
      let yourAnswer = await getExistingVote(userId!, userSource, question.id);

      if (yourAnswer || state?.step === 'results') {
        if (!yourAnswer) {
          yourAnswer = answers[buttonIndex! - 1];

          const success = await setAnswer(
            question?.id,
            yourAnswer.id!,
            userId!,
            userSource,
            username,
            contentId,
          );

          if (!success) {
            return (
              <Error
                previousFrame={previousFrame}
                message="Error setting answer"
              />
            );
          }
        }

        const stats = await getStats(question.id);

        return (
          <Result
            previousFrame={previousFrame}
            state={state}
            stats={stats!}
            yourAnswer={yourAnswer}
          />
        );
      }
      if (state?.step === 'answers') {
        return (
          <Answers
            previousFrame={previousFrame}
            state={state}
            question={question}
            answers={answers}
          />
        );
      }
    }

    const paramId = Number(props.searchParams?.id);
    if (!paramId) {
      return (
        <Error previousFrame={previousFrame} message="Invalid Question Id" />
      );
    }
    const question = await getQuestion(paramId);

    if (!question) {
      return (
        <Error previousFrame={previousFrame} message="Question not found" />
      );
    }

    const answers = await getAnswers(paramId);
    return (
      <Intro
        previousFrame={previousFrame}
        state={state}
        question={question}
        answers={answers}
      />
    );
  } catch (e) {
    const error = e as Error;
    console.log('error', error);
    console.error(error);
    return (
      <Error
        previousFrame={previousFrame}
        message={error.message}
        detail={error.stack}
      />
    );
  }
}
