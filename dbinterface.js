// let upsertSession = ({sessionID: sessionID, code = null, valid = false, user_id = null}) => {	
// 	let expires = new Date()
// 	expires.setDate(expires.getDate() + 30)
// 	return db.query('INSERT INTO sessions\
// 		(code, session_id, expires, valid, user_id)\
// 		values ($1, $2, $3, $4, $5)\
// 		ON CONFLICT (session_id) DO UPDATE\
// 		SET\
// 			code = COALESCE(sessions.code, $1),\
// 			session_id = COALESCE(sessions.session_id, $2),\
// 			expires = COALESCE(sessions.expires, $3),\
// 			valid = COALESCE(sessions.valid, $4),\
// 			user_id = COALESCE(sessions.user_id, $5)\
// 		RETURNING *',
// 		[code, sessionID, expires, valid, user_id])
// }


// let removeSession = (sessionID) => {
// 	return db.query('\
// 		DELETE FROM sessions\
// 		WHERE session_id = $1',
// 		[sessionID])
// }


// let getStudyPrompts = (studyID) => {
// 	return db.query('\
// 		SELECT \
// 			prompt_text, \
// 			id\
// 		FROM prompts\
// 		where prompts.study = $1',
// 		[studyID]) 
// }

// let getUserStudies = ({userID}) => {
// 	return db.query('SELECT * FROM studies;')
// }

// let getResponse = ({userID, promptID}) => {
// 	return db.query('\
// 		SELECT\
// 			response_text\
// 		FROM\
// 		 responses\
// 		WHERE\
// 			user_id = $1 AND\
// 			prompt_id = $2',
// 			[userID, promptID])
// }

// let upsertResponse = ({responseText, userID, promptID}) => {
// 	return db.query('\
// 		INSERT INTO responses\
// 		(response_text, user_id, prompt_id)\
// 		values ($1, $2, $3)\
// 		ON CONFLICT (user_id, prompt_id) DO UPDATE\
// 		SET\
// 			response_text = $1,\
// 			user_id = $2,\
// 			prompt_id = $3\
// 		RETURNING *',
// 		[responseText, userID, promptID])
// }

// // -------- ADMIN ------- //
// let createStudy = (name, startDate, endDates) => {
// 		return db.query('\
// 			INSERT INTO studies (name)\
// 			values ($1) RETURNING *',
// 			[name])
// }

// let createPrompt = (prompt, studyId, sentDate) => {
// 		return db.query('\
// 			INSERT INTO prompts (prompt_text, study, sent_on)\
// 			values ($1, $2, $3) RETURNING *',
// 			[prompt, studyId, sentDate])
// }

// let createResponse = (response_text, userId, promptId) => {
// 		return db.query('\
// 			INSERT INTO responses (response_text, user_id, prompt_id)\
// 			values ($1, $2, $3) RETURNING *',
// 			[response_text, userId, promptId])
// }


let pg = require('pg')

const db = new pg.Pool({
	host: process.env.DB_HOST,
	port: 5432,
	password: process.env.DB_PASSWORD,
	user: process.env.DB_USER,
	database: process.env.DB_NAME,
	max: 10,
	idleTimeoutMillis: 30000
})
hppd:
db.on('error', err => {
	throw err 
})

const createUser = ({name, email, password, ethAddress}) => {
	return db.query('\
		insert into users (name, email, password, eth_address, karma)\
		values ($1, $2, $3, $4, $5)\
		RETURNING *', 
		[name, email, password, ethAddress, 0])
}

const getUser = (id) => {
	return db.query('\
		select * from users\
		where id = $1',
		[id])
}

const createGoal = ({goalAmount, intermediateAddress, decription, creator_id}) => {
	return db.query('\
		insert into goals (goal_amount, intermediate_address, decription, creator_id)\
		values ($1, $2, $3, $4) RETURNING *',
		[goalAmount, intermediateAddress, decription, creator_id])
}

const getGoal = (id) => {
	return db.query('\
		select * from goals\
		where goal.id = $1', 
		[id])
}

const createSession = (sessionID, userID, expiration) => {
	return db.query('\
		insert into sessions (session_id, user_id, expires_at)\
		values ($1, $2, $3)\
		RETURNING *',
		[sessionID, userID, expiration])
}

const deleteSession = (sessionID) => {
	return db.query('\
		delete session where session_id = $1',
		[sessionID])
}
const getSession = (sessionID) => {
	return db.query('\
		select * from sessions \
		where session_id = $1\
		ORDER BY created_at DESC',
		[sessionID])
}

module.exports = {
	getUser,
	createUser,
	getGoal,
	createGoal,
	createSession,
	getSession
}
