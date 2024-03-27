import {
  FrameContainer,
  FrameImage,
  FrameButton,
  type PreviousFrame,
} from 'frames.js/next/server';
import type { AnswerDAO, QuestionDAO, State } from '../types';

export function Intro({
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
    <>
      <h1>{question.body}</h1>
      <ul>
        {answers.map((answer, index: number) => (
          <li key={answer.id}>
            {index}-&nbsp;{answer.body}
          </li>
        ))}
      </ul>
      <FrameContainer
        postUrl="/frames"
        pathname="/"
        state={{ ...state, step: 'answers', questionId: question.id }}
        previousFrame={previousFrame}
      >
        <FrameImage>
          <div tw="w-full h-full bg-slate-700 text-white justify-center items-center flex flex-col text-4xl p-20">
            <span tw="text-5xl">{question.body}</span>
          </div>
        </FrameImage>
        <FrameButton>Participate</FrameButton>
      </FrameContainer>
    </>
  );
}
