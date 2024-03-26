import {
  isDscvrFrameMessage,
  validateDscvrFrameMessage,
} from '@dscvr-one/frames-adapter';
import type { FrameActionPayload } from 'frames.js';
import { getFrameMessage } from 'frames.js/next/server';
import { dscvrApiUrl, getData } from './dscvr';
import type { UserSource } from '../types';

export const validateFrameMessage = async (
  frameActionPayload: FrameActionPayload,
) => {
  let userId: string | undefined;
  let contentId: string | undefined;
  let username: string | undefined;
  let userSource: UserSource = 'DSCVR';
  let inputText: string | undefined;
  if (isDscvrFrameMessage(frameActionPayload)) {
    const frameMessage = await validateDscvrFrameMessage(
      frameActionPayload,
      dscvrApiUrl,
    );
    inputText = frameMessage.inputText;
    userId = frameMessage.dscvrId;
    contentId = frameMessage.contentId;

    const user = await getData(userId!);
    username = user?.user?.username;
  } else {
    const frameMessage = await getFrameMessage(frameActionPayload);
    if (!frameMessage) {
      throw new Error('Invalid Farcaster Message');
    }
    inputText = frameMessage.inputText;
    userId = frameMessage.requesterFid.toString();
    userSource = 'Farcaster';
    username = frameMessage.requesterUserData?.username;
  }

  return {
    userId,
    contentId,
    username,
    userSource,
    inputText,
  };
};
