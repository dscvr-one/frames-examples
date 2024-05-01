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
import AddressStep from '../components/address';
import AmountStep from '../components/amount';
import ProcessStep from '../components/process';
import ResultStep from '../components/result';
import { handleTransactionResult } from '../api/transaction-result';
import { getCluster } from '../api/transaction';

export default async function Page(props: NextServerPageProps) {
  const previousFrame = getPreviousFrame<State>(props.searchParams);
  const [state] = useFramesReducer<State>((state) => state, {}, previousFrame);

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
        <AddressStep
          previousFrame={previousFrame}
          state={state}
          username={data.user.username}
        />
      );
    }

    if (state.step === 'address') {
      if (!frameMessage.inputText) {
        return (
          <AddressStep
            previousFrame={previousFrame}
            state={state}
            username={data.user.username}
            warning="Invalid address"
          />
        );
      }

      return (
        <AmountStep
          previousFrame={previousFrame}
          state={{ ...state, address: frameMessage.inputText }}
          username={data.user.username}
        />
      );
    }

    if (state.step === 'amount') {
      const amount = Number(frameMessage.inputText);
      if (isNaN(amount) || !amount) {
        return (
          <AmountStep
            previousFrame={previousFrame}
            state={state}
            username={data.user.username}
            warning="Invalid amount"
          />
        );
      }
      const tokenType = frameMessage.buttonIndex === 1 ? 'SOL' : 'WIF';
      const cluster = getCluster();
      if (tokenType === 'WIF' && cluster !== 'mainnet-beta') {
        return (
          <AmountStep
            previousFrame={previousFrame}
            state={state}
            username={data.user.username}
            warning="Only mainnet-beta is supported for SPL tokens"
          />
        );
      }

      return (
        <ProcessStep
          previousFrame={previousFrame}
          state={{ ...state, amount, tokenType }}
          username={data.user.username}
        />
      );
    }

    if (state.step === 'process') {
      const userAddress = frameMessage.address;
      const transactionId = frameMessage.transactionId;
      if (!userAddress) {
        throw new Error('Invalid address');
      }
      if (!transactionId) {
        throw new Error('Invalid transaction Id');
      }
      await handleTransactionResult(
        userAddress,
        transactionId,
        state.address!,
        state.amount!,
        state.tokenType!,
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
