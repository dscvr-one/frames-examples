-- Setup structure
CREATE SCHEMA IF NOT EXISTS poll;

CREATE TABLE IF NOT EXISTS poll.question(
    id serial PRIMARY KEY,
    body varchar(255) NOT NULL,
    votes integer DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ  DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS poll.answer(
    id serial PRIMARY KEY,
    question_id integer references poll.question(id) ON DELETE CASCADE,
    body varchar(255) NOT NULL,
    votes integer DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ  DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS poll.vote(
    id serial PRIMARY KEY,
    answer_id integer references poll.answer(id) ON DELETE CASCADE,
    user_source varchar(50) NOT NULL,
    user_id varchar(255) NOT NULL,
    username varchar(255) NULL,
    content_id varchar(255) NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ  DEFAULT CURRENT_TIMESTAMP
);

-- Sample Data
INSERT INTO poll.question (body) VALUES ('Which is your favorite programming language?');

INSERT INTO poll.answer (question_id, body) VALUES ((SELECT max(id) FROM poll.question), 'JavaScript');
INSERT INTO poll.answer (question_id, body) VALUES ((SELECT max(id) FROM poll.question), 'Python');
INSERT INTO poll.answer (question_id, body) VALUES ((SELECT max(id) FROM poll.question), 'Java');
INSERT INTO poll.answer (question_id, body) VALUES ((SELECT max(id) FROM poll.question), 'Rust');
