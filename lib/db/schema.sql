-- Chat question capture for analytics. One row per inbound user question.
-- Designed for fast time-windowed reads and per-session grouping.

CREATE TABLE IF NOT EXISTS chat_questions (
  id              BIGSERIAL PRIMARY KEY,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  session_id      TEXT        NOT NULL,
  turn_index      INT         NOT NULL,
  question        TEXT        NOT NULL,
  question_length INT         NOT NULL,
  source          TEXT        NOT NULL,
  model           TEXT,
  country         TEXT,
  region          TEXT,
  ip_hash         TEXT,
  ua_family       TEXT
);

CREATE INDEX IF NOT EXISTS idx_chat_questions_created_at
  ON chat_questions (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_chat_questions_session
  ON chat_questions (session_id, turn_index);
