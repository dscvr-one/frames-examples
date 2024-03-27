-- Setup structure
CREATE SCHEMA IF NOT EXISTS quiz;

CREATE TABLE IF NOT EXISTS quiz.question(
    id serial PRIMARY KEY,
    body varchar(255) NOT NULL,
    answer varchar(255) NULL,
    correct_count integer DEFAULT 0,
    claimed_count integer DEFAULT 0,
    total_count integer DEFAULT 0,
    max_tries integer DEFAULT 3,
    giveaway_limit integer DEFAULT 1,
    nft_url varchar(255) NULL,
    award_url varchar(255) NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ  DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quiz.answer(
    id serial PRIMARY KEY,
    question_id integer references quiz.question(id) ON DELETE CASCADE,
    body varchar(255) NOT NULL,
    is_true boolean DEFAULT false,
    is_giveaway boolean DEFAULT false,
    is_claimed boolean DEFAULT false,
    user_source varchar(50) NOT NULL,
    user_id varchar(255) NOT NULL,
    username varchar(255) NULL,
    content_id varchar(255) NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ  DEFAULT CURRENT_TIMESTAMP
);

-- Sample Data
INSERT INTO quiz.question (body, answer, giveaway_limit, nft_url, award_url) 
    VALUES (
        'Which cryptocurrency is often referred to as "digital silver" to Bitcoin''s "digital gold"?',
        'Litecoin',
        500,
        'https://img-cdn.magiceden.dev/rs:fill:400:0:0/plain/https%3A%2F%2Fbafybeif2cxudo4ehs2qk4pybc6owtzu2znu4qpeppmabtmfl3ryaqkzwf4.ipfs.nftstorage.link%2F1.png%3Fext%3Dpng',
        'https://shorturl.at/gqtER');
