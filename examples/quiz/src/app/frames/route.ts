import { NextRequest, NextResponse } from 'next/server';
import { POST as BasePost, RedirectMap } from 'frames.js/next/server';
import { getQuestion, markAsClaimed } from '@/src/api/content';
import { State } from '@/src/types';

// TODO: this is a workaround since frams.js redirects redirectHandler is not working
// this https://github.com/framesjs/frames.js/blob/main/packages/frames.js/src/next/server.tsx#L272 should be
// `Object.fromEntries(newUrl.searchParams.entries())` instead
const getRedirects = (req: NextRequest) => {
  const url = new URL(req.url);
  const redirectsStr = url.searchParams.get('r');
  const frameStateStr = url.searchParams.get('s');
  if (redirectsStr && frameStateStr) {
    const redirects: RedirectMap = JSON.parse(redirectsStr);
    const frameState: State = JSON.parse(frameStateStr);
    return { redirects, frameState };
  }
  return undefined;
};

export async function POST(req: NextRequest, res: typeof NextResponse) {
  const result = getRedirects(req);
  if (result) {
    const { redirects, frameState } = result;
    if (redirects && '_1' in redirects && frameState?.step === 'results') {
      if (!frameState.questionId || !frameState.answerId) {
        throw Error('Invalid state');
      }

      await markAsClaimed(frameState.questionId, frameState.answerId);

      const question = await getQuestion(frameState.questionId);

      return NextResponse.redirect(question.award_url, { status: 302 });
    }
  }

  return BasePost(req, res);
}
