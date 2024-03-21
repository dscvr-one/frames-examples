import {
  useFramesReducer,
  getPreviousFrame,
  type NextServerPageProps,
} from 'frames.js/next/server';
import type { State } from '../types';
import { getQuestion, getExistingAnswers, setAnswer } from '../api/content';
import { validateFrameMessage } from '../api/validation';
import Error from '../components/error';
import Intro from '../components/intro';
import Question from '../components/question';
import Result from '../components/result';

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

      const { userId, contentId, username, userSource, inputText } =
        await validateFrameMessage(previousFrame.postBody);
      const answers = await getExistingAnswers(
        userId!,
        userSource,
        state.questionId,
      );

      const unclaimedAnswer = answers?.find(
        (a) => a.is_true && a.is_giveaway && !a.is_claimed,
      );

      if (unclaimedAnswer) {
        return (
          <Result
            previousFrame={previousFrame}
            state={state}
            question={question}
            givenAnswer={unclaimedAnswer}
            answers={answers}
          />
        );
      }

      if (state?.step === 'question') {
        return (
          <Question
            previousFrame={previousFrame}
            state={state}
            question={question}
            answers={answers}
          />
        );
      }

      if (state?.step === 'results') {
        if (answers?.length && answers.length >= question.max_tries) {
          return (
            <Error
              previousFrame={previousFrame}
              message="Maximum attempts exceeded"
            />
          );
        }

        const givenAnswer = await setAnswer(
          question,
          inputText!,
          userId!,
          userSource,
          username,
          contentId,
        );

        if (!givenAnswer) {
          return (
            <Error
              previousFrame={previousFrame}
              message="Error setting answer"
            />
          );
        }

        return (
          <Result
            previousFrame={previousFrame}
            state={state}
            question={question}
            givenAnswer={givenAnswer}
            answers={answers}
          />
        );
      }

      return <Error previousFrame={previousFrame} message="Unknown state" />;
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

    return (
      <Intro previousFrame={previousFrame} state={state} question={question} />
    );
  } catch (e) {
    const error = e as Error;
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
