CREATE TABLE IF NOT EXISTS goals(
	id serial primary key,
	goal_amount int,
	intermediate_address text,
	decription text,
	creator_id int references users(id)
);