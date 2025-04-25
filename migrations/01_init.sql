-- up
CREATE TABLE user (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL,
  discord_id TEXT UNIQUE NOT NULL,
  session TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- down
DROP TABLE user;
