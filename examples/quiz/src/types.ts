export type UserSource = 'DSCVR' | 'Farcaster';
export type Step = 'intro' | 'question' | 'results';
export type State = {
  step: Step;
  questionId?: number;
  answerId?: number;
};

export type QuestionDAO = {
  id: number;
  body: string;
  answer: string;
  correct_count: number;
  claimed_count: number;
  total_count: number;
  max_tries: number;
  giveaway_limit: number;
  nft_url: string;
  award_url: string;
  created_at: number;
  updated_at: number;
};

export type AnswerDAO = {
  id: number;
  question_id: number;
  body: string;
  is_true: boolean;
  is_giveaway: boolean;
  is_claimed: boolean;
  user_source: string;
  user_id: string;
  username?: string;
  content_id?: string;
  created_at: number;
  updated_at: number;
};
