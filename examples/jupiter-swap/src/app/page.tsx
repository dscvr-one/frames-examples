'use server';

import {
  useFramesReducer,
  getPreviousFrame,
  type NextServerPageProps,
} from 'frames.js/next/server';
import {
  isDscvrFrameMessage,
  validateDscvrFrameMessage,
} from '@dscvr-one/frames-adapter';
import { dscvrApiUrl, getData } from '../api/dscvr';
import type { State } from '../types';
import ErrorStep from '../components/error';
import IntroStep from '../components/intro';
import TokenStep from '../components/token';
import AmountStep from '../components/amount';
import SwapStep from '../components/swap';
import ResultStep from '../components/result';
import { handleTransactionResult } from '../api/transaction-result';
import { getToken } from '../api/jupiter';

export default async function Page(props: NextServerPageProps) {
  const previousFrame = getPreviousFrame<State>(props.searchParams);
  const [state] = useFramesReducer<State>(
    (state) => state,
    { page: 0 },
    previousFrame,
  );

  if (!previousFrame.postBody) {
    return <IntroStep previousFrame={previousFrame} state={state} />;
  }

  try {
    if (
      !previousFrame.postBody ||
      !isDscvrFrameMessage(previousFrame.postBody)
    ) {
      throw new Error('This is not a DSCVR Frame');
    }

    const frameMessage = await validateDscvrFrameMessage(
      previousFrame.postBody,
      dscvrApiUrl,
    );

    const data = await getData(frameMessage.dscvrId, frameMessage.contentId);
    if (!data?.user) {
      throw new Error('User not found');
    }

    if (state.step === 'intro') {
      return (
        <TokenStep
          previousFrame={previousFrame}
          state={state}
          type="source"
          username={data.user.username}
        />
      );
    }

    if (state.step === 'source' || state.step === 'target') {
      if (!state.actions || !frameMessage.buttonIndex) {
        throw new Error('Invalid token actions');
      }
      const action = state.actions[frameMessage.buttonIndex - 1];
      if (!action) {
        throw new Error('Invalid token action');
      }
      if (action === 'prev') {
        return (
          <TokenStep
            previousFrame={previousFrame}
            state={{ ...state, page: state.page - 1 }}
            username={data.user.username}
          />
        );
      }

      if (action === 'next') {
        return (
          <TokenStep
            previousFrame={previousFrame}
            state={{ ...state, page: state.page + 1 }}
            username={data.user.username}
          />
        );
      }

      if (action === 'select') {
        const token = frameMessage.inputText
          ? await getToken(frameMessage.inputText)
          : undefined;
        if (!token) {
          return (
            <TokenStep
              previousFrame={previousFrame}
              state={state}
              username={data.user.username}
              warning="Invalid token"
            />
          );
        }
        if (state.step === 'source') {
          return (
            <TokenStep
              previousFrame={previousFrame}
              state={{
                ...state,
                srcTkn: token.type,
              }}
              type="target"
              username={data.user.username}
            />
          );
        }

        if (token.type === state.srcTkn) {
          return (
            <TokenStep
              previousFrame={previousFrame}
              state={state}
              username={data.user.username}
              warning="You must select a different token"
            />
          );
        }
        return (
          <AmountStep
            previousFrame={previousFrame}
            state={{
              ...state,
              trgtTkn: frameMessage.inputText,
            }}
            username={data.user.username}
          />
        );
      }
    }

    if (state.step === 'amount') {
      const amount = Number(frameMessage.inputText);
      if (!amount) {
        return (
          <AmountStep
            previousFrame={previousFrame}
            state={state}
            username={data.user.username}
            warning="Invalid amount"
          />
        );
      }

      return (
        <SwapStep
          previousFrame={previousFrame}
          state={{ ...state, amount }}
          username={data.user.username}
        />
      );
    }

    if (state.step === 'swap') {
      const userAddress = frameMessage.address;
      const transactionId = frameMessage.transactionId;
      if (!userAddress) {
        throw new Error('Invalid address');
      }
      if (!transactionId) {
        throw new Error('Invalid address');
      }

      await handleTransactionResult(
        userAddress,
        transactionId,
        state.srcTkn!,
        state.trgtTkn!,
        state.amount!,
      );

      return (
        <ResultStep
          previousFrame={previousFrame}
          state={state}
          username={data.user.username}
          userAddress={userAddress}
          transactionId={transactionId}
        />
      );
    }

    throw new Error('Invalid step');
  } catch (e) {
    const error = e as Error;

    return (
      <ErrorStep previousFrame={previousFrame} state={state} error={error} />
    );
  }
}
