import type { PreviousFrame } from 'frames.js/next/types';
import type { State } from '../types';
import { FrameButton, FrameContainer, FrameImage } from 'frames.js/next/server';

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
            You successfully sent {`${amountStr} ${state.tokenType}`} to the
            address {state.address} from your wallet {userAddress}
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
