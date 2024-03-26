import {
  FrameContainer,
  FrameImage,
  FrameButton,
  type PreviousFrame,
} from 'frames.js/next/server';
import type { AnswerDAO, QuestionDAO, State } from '../types';

export function Answers({
  previousFrame,
  state,
  question,
  answers,
}: {
  previousFrame: PreviousFrame;
  state: State;
  question: QuestionDAO;
  answers: AnswerDAO[];
}) {
  return (
    <FrameContainer
      postUrl="/frames"
      pathname="/"
      state={{
        ...state,
        step: 'results',
      }}
      previousFrame={previousFrame}
    >
      <FrameImage>
        <div tw="w-full h-full bg-slate-700 text-white justify-center items-center flex flex-col text-4xl p-20">
          <div tw="flex flex-col">
            <span tw="text-5xl">{question.body}</span>
            <ul tw="flex flex-col mt-8">
              {answers!.map((answer, index: number) => (
                <li key={answer.id} tw="mb-2">
                  {index + 1}-&nbsp;{answer.body}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </FrameImage>
      <FrameButton>1</FrameButton>
      <FrameButton>2</FrameButton>
      {answers!.length > 2 ? <FrameButton>3</FrameButton> : null}
      {answers!.length > 3 ? <FrameButton>4</FrameButton> : null}
    </FrameContainer>
  );
}
