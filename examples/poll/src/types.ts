export type UserSource = 'DSCVR' | 'Farcaster';
export type Step = 'intro' | 'answers' | 'results';
export type State = {
  step: Step;
  questionId?: number;
};

export type QuestionDAO = {
  id: number;
  body: string;
  votes: number;
  created_at: number;
  updated_at: number;
};

export type AnswerDAO = {
  id: number;
  question_id: number;
  body: string;
  votes: number;
  created_at: number;
  updated_at: number;
};

export type VoteDAO = {
  id: number;
  answer_id: number;
  user_source: string;
  user_id: string;
  username?: string;
  content_id?: string;
  created_at: number;
  updated_at: number;
};

export type PollStats = {
  question: string;
  totalVotes: number;
  answers: {
    id: number;
    body: string;
    votes: number;
  }[];
};
