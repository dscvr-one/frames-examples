import type {
  AnswerDAO,
  PollStats,
  QuestionDAO,
  UserSource,
  VoteDAO,
} from '../types';
import pool from '../db/postgresql';

export const getQuestion = async (id: number): Promise<QuestionDAO> => {
  const query = `SELECT * FROM poll.question WHERE id = $1`;
  const { rows } = await pool.query<QuestionDAO>(query, [id]);
  return rows[0];
};

export const getAnswers = async (id: number): Promise<AnswerDAO[]> => {
  const { rows } = await pool.query<AnswerDAO>(
    `SELECT * FROM poll.answer WHERE question_id = $1 ORDER BY id ASC;`,
    [id],
  );

  return rows;
};

export const getExistingVote = async (
  userId: string,
  userSource: UserSource,
  questionId: number,
): Promise<AnswerDAO | null> => {
  const { command, rows } = await pool.query<AnswerDAO>(
    `SELECT answer.* FROM poll.answer
        JOIN poll.vote ON vote.answer_id = answer.id
        WHERE vote.user_id = $1 AND vote.user_source = $2 AND answer.question_id = $3;`,
    [userId, userSource, questionId],
  );

  if (command === 'SELECT' && rows.length > 0) {
    return rows[0];
  }
  return null;
};

export const setAnswer = async (
  questionId: number,
  answerId: number,
  userId: string,
  userSource: UserSource,
  username?: string,
  contentId?: string,
) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    await client.query<VoteDAO>(
      `
      INSERT INTO poll.vote (answer_id, user_source, user_id, username, content_id) VALUES ($1, $2, $3, $4, $5);
      `,
      [answerId, userSource, userId, username, contentId],
    );

    await client.query(
      `
      UPDATE poll.answer SET updated_at = CURRENT_TIMESTAMP, votes = (SELECT count(*) FROM poll.vote WHERE answer_id = $1) WHERE id = $1;
      `,
      [answerId],
    );
    await client.query(
      `
        UPDATE poll.question SET updated_at = CURRENT_TIMESTAMP, votes = (SELECT sum(votes) FROM poll.answer WHERE question_id = $1) WHERE id = $1;
        `,
      [questionId],
    );
    await client.query('COMMIT');

    return true;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

export const getStats = async (id: number): Promise<PollStats | null> => {
  const questionStatsResult = await pool.query<{ body: string; votes: number }>(
    `SELECT body, votes FROM poll.question WHERE id = $1;`,
    [id],
  );

  if (
    questionStatsResult.command !== 'SELECT' ||
    !questionStatsResult.rowCount
  ) {
    return null;
  }
  const answersStatsResult = await pool.query<{
    id: number;
    body: string;
    votes: number;
  }>(
    `SELECT id, body, votes FROM poll.answer WHERE question_id = $1 ORDER BY votes DESC;`,
    [id],
  );

  if (answersStatsResult.command !== 'SELECT' || !answersStatsResult.rowCount) {
    return null;
  }

  return {
    question: questionStatsResult.rows[0].body,
    totalVotes: questionStatsResult.rows[0].votes,
    answers: answersStatsResult.rows.map((row) => ({
      id: row.id,
      body: row.body,
      votes: row.votes,
    })),
  };
};
