-- Drop tables if they exist
DROP TABLE IF EXISTS group_members;
DROP TABLE IF EXISTS groups;
DROP TABLE IF EXISTS events;

-- Create tables
CREATE TABLE events (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    date_time DATETIME NOT NULL,
    group_size_limit INTEGER NOT NULL,
    location TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id TEXT NOT NULL,
    creator_name TEXT NOT NULL,
    creator_email TEXT NOT NULL,
    group_name TEXT NOT NULL,
    accepts_others BOOLEAN NOT NULL DEFAULT 0,
    project_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events (id)
);

CREATE TABLE group_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    FOREIGN KEY (group_id) REFERENCES groups (id)
);

-- Create indexes for better query performance
CREATE INDEX idx_groups_event_id ON groups(event_id);
CREATE INDEX idx_group_members_group_id ON group_members(group_id);
