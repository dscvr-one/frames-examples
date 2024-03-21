import { PoolClient } from 'pg';
import pool from '../db/postgresql';
import type { AnswerDAO, QuestionDAO, UserSource } from '../types';

export const getQuestion = async (id: number): Promise<QuestionDAO> => {
  const query = `SELECT * FROM quiz.question WHERE id = $1`;
  const { rows: questions } = await pool.query(query, [id]);
  return questions[0];
};

export const getExistingAnswers = async (
  userId: string,
  userSource: UserSource,
  questionId: number,
): Promise<AnswerDAO[] | null> => {
  const { command, rows } = await pool.query<AnswerDAO>(
    `SELECT * FROM quiz.answer
        WHERE user_id = $1 AND user_source = $2 AND question_id = $3`,
    [userId, userSource, questionId],
  );

  if (command === 'SELECT' && rows.length > 0) {
    return rows;
  }
  return null;
};

const updateQuestionStats = (client: PoolClient, questionId: number) => {
  return client.query(
    `
      UPDATE quiz.question 
        SET updated_at = CURRENT_TIMESTAMP, 
            total_count = (SELECT count(*) FROM quiz.answer WHERE question_id = $1),
            correct_count = (SELECT count(*) FROM quiz.answer WHERE question_id = $1 AND is_true = true)
        WHERE id = $1;
      `,
    [questionId],
  );
};

export const setAnswer = async (
  question: QuestionDAO,
  body: string,
  userId: string,
  userSource: UserSource,
  username?: string,
  contentId?: string,
): Promise<AnswerDAO | null> => {
  const isTrue =
    question.answer.trim().toLowerCase() === body.trim().toLowerCase();
  const isGiveaway = isTrue && question.giveaway_limit > question.correct_count;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const insertResult = await client.query<AnswerDAO>(
      `
      INSERT INTO quiz.answer (question_id, body, is_true, is_giveaway, user_source, user_id, username, content_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;
      `,
      [
        question.id,
        body,
        isTrue,
        isGiveaway,
        userSource,
        userId,
        username,
        contentId,
      ],
    );

    await updateQuestionStats(client, question.id);
    await client.query('COMMIT');

    return insertResult.rows[0];
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

export const markAsClaimed = async (questionId: number, answerId: number) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    await client.query<AnswerDAO>(
      `
      UPDATE quiz.answer 
        SET updated_at = CURRENT_TIMESTAMP, 
            is_claimed = true
        WHERE id = $1;
      `,
      [answerId],
    );

    await updateQuestionStats(client, questionId);
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};
