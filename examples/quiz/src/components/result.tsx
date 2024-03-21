import {
  FrameButton,
  FrameContainer,
  FrameImage,
  FrameInput,
  type PreviousFrame,
} from 'frames.js/next/server';
import type { AnswerDAO, QuestionDAO, State } from '../types';

export default function Result({
  previousFrame,
  state,
  question,
  givenAnswer,
  answers,
}: {
  previousFrame: PreviousFrame<State>;
  state: State;
  question: QuestionDAO;
  givenAnswer: AnswerDAO;
  answers: AnswerDAO[] | null;
}) {
  const triesLeft = question.max_tries - (answers?.length ?? 0) - 1;
  const answerId =
    givenAnswer.is_true && givenAnswer.is_giveaway ? givenAnswer.id : undefined;

  return (
    <FrameContainer<State>
      postUrl="/frames"
      pathname="/"
      state={{
        ...state,
        step: 'results',
        answerId,
      }}
      previousFrame={previousFrame}
    >
      <FrameImage>
        <div tw="w-full h-full bg-white text-black justify-center items-center flex flex-col text-4xl p-20">
          <span tw="text-5xl">{question.body}</span>
          {givenAnswer.is_true ? (
            <p tw="justify-center items-center flex flex-col ">
              <span tw="text-indigo-500 mt-6">
                Correct, the answer is {givenAnswer.body}!
              </span>
              {givenAnswer.is_giveaway ? (
                <span tw="mt-6">
                  Please follow the link to collect your NFT!
                </span>
              ) : (
                <span tw="mt-6">
                  {' '}
                  Unfortunately you are not among the first{' '}
                  {question.giveaway_limit}
                </span>
              )}
            </p>
          ) : triesLeft > 0 ? (
            <span tw="mt-6">Incorrect, you have {triesLeft} more attempts</span>
          ) : (
            <span tw="mt-6">Sorry, you have reached the maximum attempts.</span>
          )}
        </div>
      </FrameImage>
      {givenAnswer.is_true && givenAnswer.is_giveaway ? (
        <FrameButton action="post_redirect">Claim your NFT</FrameButton>
      ) : null}
      {!givenAnswer.is_true && triesLeft > 0 ? (
        <FrameInput text="Type your answer" />
      ) : null}
      {!givenAnswer.is_true && triesLeft > 0 ? (
        <FrameButton>Submit</FrameButton>
      ) : null}
    </FrameContainer>
  );
}
