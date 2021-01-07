CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(320) NOT NULL,
  password CHAR(60) NOT NULL
);

CREATE UNIQUE INDEX ON users((lower(email)));

CREATE TABLE entry_type (
  id SERIAL PRIMARY KEY,
  description VARCHAR(20) NOT NULL
);

CREATE TABLE sleep_entries (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
  type_id INTEGER REFERENCES entry_type(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
  duration NUMERIC(4,2) NOT NULL,
  quality INTEGER NOT NULL,
  sleep_date DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE eating_entries (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
  quality INTEGER NOT NULL,
  regularity INTEGER NOT NULL,
  eating_date DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE study_entries (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
  duration NUMERIC(4,2) NOT NULL,
  study_date DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE mood_entries (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
  type_id INTEGER REFERENCES entry_type(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
  mood_score INTEGER NOT NULL,
  mood_date DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE sport_entries (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
  duration NUMERIC(4,2) NOT NULL,
  sport_date DATE NOT NULL DEFAULT CURRENT_DATE
);

INSERT INTO entry_type (description) VALUES ('morning');
INSERT INTO entry_type (description) VALUES ('evening');
