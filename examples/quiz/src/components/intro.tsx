import {
  FrameButton,
  FrameContainer,
  FrameImage,
  type PreviousFrame,
} from 'frames.js/next/server';
import type { QuestionDAO, State } from '../types';

export default function Intro({
  previousFrame,
  state,
  question,
}: {
  previousFrame: PreviousFrame;
  state: State;
  question: QuestionDAO;
}) {
  const hasEnded = question.correct_count >= question.giveaway_limit;

  return (
    <>
      <h1>{question.body}</h1>
      <FrameContainer
        postUrl="/frames"
        pathname="/"
        state={{ ...state, step: 'question', questionId: question.id }}
        previousFrame={previousFrame}
      >
        <FrameImage>
          <div tw="w-full h-full bg-slate-700 text-white justify-center items-center flex flex-col text-4xl p-20">
            {hasEnded ? (
              <div tw="justify-center items-center flex flex-col ">
                <span tw="text-5xl">This quiz has ended</span>
                <span tw="mt-6">Congratulations to the winners</span>
              </div>
            ) : (
              <div tw="justify-center items-center flex flex-col ">
                <span>
                  This is an example of a frame that will redirect the user to
                  an external link to purchase the DSCVR Explorer Pass, If you
                  are among the first {question.giveaway_limit} correct answers.
                </span>
                <img
                  src={question.nft_url}
                  tw="rounded-md mt-10"
                  width={200}
                  height={200}
                />
              </div>
            )}
          </div>
        </FrameImage>
        {!hasEnded ? <FrameButton>Participate</FrameButton> : null}
      </FrameContainer>
    </>
  );
}
