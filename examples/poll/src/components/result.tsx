import {
  FrameContainer,
  FrameImage,
  type PreviousFrame,
} from 'frames.js/next/server';
import type { AnswerDAO, PollStats, State } from '../types';

export function Result({
  previousFrame,
  state,
  stats,
  yourAnswer,
}: {
  previousFrame: PreviousFrame;
  state: State;
  stats: PollStats;
  yourAnswer: AnswerDAO;
}) {
  const getPercentage = (votes: number, totalVotes: number) =>
    totalVotes ? Math.round((votes / totalVotes) * 100) : 0;

  return (
    <FrameContainer
      postUrl="/frames"
      pathname="/"
      state={{ ...state, step: 'results' }}
      previousFrame={previousFrame}
    >
      <FrameImage>
        <div tw="w-full h-full bg-slate-700 text-white justify-center items-center flex flex-col text-4xl p-20">
          <div tw="flex flex-col">
            <span tw="text-5xl">
              {stats.question} ({stats.totalVotes})
            </span>
            <ul tw="flex flex-col mt-8">
              {stats.answers.map((answer) => (
                <li key={answer.id} tw="flex items-center mb-2">
                  <span>{`- ${answer.body}: `}</span>
                  <span tw="ml-2">
                    {getPercentage(answer.votes, stats.totalVotes)}%
                  </span>
                  <span tw="ml-2">({answer.votes})</span>
                  {yourAnswer.id === answer.id ? (
                    <small tw="ml-2 text-3xl text-indigo-500">Your vote!</small>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </FrameImage>
    </FrameContainer>
  );
}
