import type { PreviousFrame } from 'frames.js/next/types';
import type { State, actions } from '../types';
import {
  FrameButton,
  FrameContainer,
  FrameImage,
  FrameInput,
} from 'frames.js/next/server';
import { getTokenList } from '../api/jupiter';

const PAGE_SIZE = 10;
export default async function Address({
  previousFrame,
  state,
  username,
  type,
  warning,
}: {
  previousFrame: PreviousFrame<State>;
  state: State;
  username: string;
  type?: 'source' | 'target';
  warning?: string;
}) {
  const tokenList = getTokenList();
  const tokenPage = tokenList.slice(
    state.page * PAGE_SIZE,
    (state.page + 1) * PAGE_SIZE,
  );
  const totalPages = Math.ceil(tokenList.length / PAGE_SIZE);
  const hasPrev = state.page > 0;
  const hasNext = tokenList.length > (state.page + 1) * PAGE_SIZE;
  const actions: actions[] = [];
  if (hasPrev) {
    actions.push('prev');
  }
  if (hasNext) {
    actions.push('next');
  }
  actions.push('select');
  const step = type || state.step;
  return (
    <FrameContainer
      postUrl="/frames"
      pathname="/"
      state={{ ...state, step, actions }}
      previousFrame={previousFrame}
    >
      <FrameImage>
        <div tw="w-full h-full bg-slate-700 text-white justify-center items-center flex flex-col p-20">
          <span tw="text-5xl mb-6 ">Hi, {username}</span>
          {warning && <span tw="text-red-500 mb-6">{warning}</span>}
          <span tw="mb-6">
            Please type a valid token type to swap{' '}
            {step === 'source' ? 'from' : 'to'}
          </span>
          <ul tw="flex flex-row flex-wrap mb-6 text-2xl">
            {tokenPage.map((token) => (
              <li tw="flex gap-4 w-1/2 h-10" key={token.type}>
                <img src={token.icon} alt={token.name} width={25} height={25} />
                <span tw="ml-6">{token.type} :</span>
                <span tw="ml-3 text-gray-400">{token.name}</span>
              </li>
            ))}
          </ul>
          <span tw="text-3xl">
            Page {state.page + 1} / {totalPages}
          </span>
        </div>
      </FrameImage>
      <FrameInput text="Type a valid token" />
      {hasPrev ? <FrameButton>← Prev Page</FrameButton> : null}
      {hasNext ? <FrameButton>Next Page →</FrameButton> : null}
      <FrameButton>Select</FrameButton>
    </FrameContainer>
  );
}
