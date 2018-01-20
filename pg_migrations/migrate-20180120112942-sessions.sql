CREATE TABLE IF NOT EXISTS sessions(
	session_id text primary key NOT NULL,
	user_id int NOT NULL,
	created_at timestamp default current_timestamp NOT NULL,
	expires_at timestamp
);