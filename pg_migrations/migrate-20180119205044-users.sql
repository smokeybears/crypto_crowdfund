CREATE TABLE IF NOT EXISTS users(
	id serial primary key,
	name text,
	email text NOT NULL UNIQUE,
	password text NOT NULL,
	eth_address text NOT NULL,
	profile_photo text,
	karma int,
	created_at timestamp default current_timestamp NOT NULL,
	deleted_at timestamp
);