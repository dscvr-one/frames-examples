import type { PreviousFrame } from 'frames.js/next/types';
import type { State } from '../types';
import { FrameButton, FrameContainer, FrameImage } from 'frames.js/next/server';
import { getToken } from '../api/jupiter';

export default async function Process({
  previousFrame,
  state,
  username,
  userAddress,
  transactionId,
}: {
  previousFrame: PreviousFrame<State>;
  state: State;
  username: string;
  userAddress: string;
  transactionId: string;
}) {
  const srcTkn = await getToken(state.srcTkn);
  const trgtTkn = await getToken(state.trgtTkn);
  const amountStr = state.amount?.toFixed(10).replace(/0+$/, '');
  return (
    <FrameContainer
      postUrl="/frames"
      pathname="/"
      state={{ ...state, step: 'result' }}
      previousFrame={previousFrame}
    >
      <FrameImage>
        <div tw="w-full h-full bg-slate-700 text-white justify-center items-center flex flex-col p-20">
          <span tw="text-5xl mb-6">Congrats, {username}</span>
          <span>
            You successfully swapped {amountStr} {srcTkn?.name} to{' '}
            {trgtTkn?.name}
            in your wallet {userAddress}
          </span>
        </div>
      </FrameImage>
      <FrameButton
        action="link"
        target={`https://solana.fm/tx/${transactionId}`}
      >
        View in solana.fm
      </FrameButton>
    </FrameContainer>
  );
}
