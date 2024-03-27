import {
  FrameButton,
  FrameContainer,
  FrameImage,
  FrameInput,
  type PreviousFrame,
} from 'frames.js/next/server';
import type { AnswerDAO, QuestionDAO, State } from '../types';

export default function Question({
  previousFrame,
  state,
  question,
  answers,
}: {
  previousFrame: PreviousFrame<State>;
  state: State;
  question: QuestionDAO;
  answers: AnswerDAO[] | null;
}) {
  const alreadyClaimed = answers?.some((a) => a.is_claimed);
  const alreadyCorrect = answers?.find((a) => a.is_true);
  const triesReached =
    !alreadyCorrect && answers && answers.length >= question.max_tries;

  return (
    <FrameContainer<State>
      postUrl="/frames"
      pathname="/"
      state={{
        ...state,
        step: 'results',
        answerId: alreadyCorrect?.id,
      }}
      previousFrame={previousFrame}
    >
      <FrameImage>
        <div tw="w-full h-full bg-slate-700 text-white justify-center items-center flex flex-col text-4xl p-20">
          <span
            tw={`text-5xl ${alreadyCorrect || triesReached ? 'text-gray-400' : ''}`}
          >
            {question.body}
          </span>
          {alreadyClaimed ? (
            <span tw="mt-10">
              You were one of the {question.giveaway_limit} winners, congrats
            </span>
          ) : alreadyCorrect ? (
            <span tw="mt-10">
              You already answered correctly, thanks for participating
            </span>
          ) : triesReached ? (
            <span tw="mt-10">Maximum attempts exceeded.</span>
          ) : null}
        </div>
      </FrameImage>
      {alreadyCorrect ? (
        <FrameButton action="post_redirect">Purchase your NFT</FrameButton>
      ) : null}
      {!triesReached && !alreadyCorrect ? (
        <FrameInput text="Type your answer" />
      ) : null}
      {!triesReached && !alreadyCorrect ? (
        <FrameButton>Submit</FrameButton>
      ) : null}
    </FrameContainer>
  );
}
