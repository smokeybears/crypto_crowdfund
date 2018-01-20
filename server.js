require('dotenv').config()
const bcrypt = require('bcrypt') 
const restify = require('restify')
const server = require('./serverInit')
const dbInterface = require('./dbinterface')
const uuidv4 = require('uuid/v4') //random generation
const Moment = require('moment')

const createUser = (req, res, next) => {
	const { name, email, password, ethAddress } = req.params
	// email uniqueness done on database side
	return bcrypt.hash(password, 10)
	.then(hash => {
		 return dbInterface.createUser({
		 	name,
		 	email,
		 	ethAddress: ethAddress,
		 	password: hash
		 })
	})
	.then(user => {
		res.json({ user: user.rows[0] })
		return next()		
	})
	.catch(err => {
		if (err.code === '23505'){
			res.json({
				error: 'User with email already exist'
			})
			res.status(409) // conflict
		} else {
			res.status(500)
			res.json({
				error: error
			})
			
		}
		return next()
	})
}

const getUser = (req, res, next) => {
	return dbInterface.getUser(req.params.id)
	.then(user => {
		res.json({
			user: user.rows
		})
		return next()
	}).catch(err => {
		res.json({
			error: err
		})
		res.status(500)
		return res.next()
	})
}

const login = (req, res, next) => {
	const reqPassword = req.params.password;
	let userID;
	return dbInterface.getUser(req.params.email)
	.then(query => {
		userID = query.rows[0].id
		const {password} = query.rows[0]
		return bcrypt.compare(reqPassword, password)
	})
	.then(validPass => {
		if (validPass){			
			const sessionID = uuidv4()
			const expiration = Moment().add(1, 'w') // set the expiration to 1 week from today
			return dbInterface.createSession(sessionID, userID, expiration.format())
		}
		return false
	})
	.then(insert => {
		// set header for cookie of sessionID
		if (insert.rows.length){
			res.setCookie('sessionID', insert.rows[0].session_id)
			res.setCookie('userID', userID)
			res.json({
				login: true,
			})
		} else {
			res.json({
				login: false,
			})
		}
		return next()
	})
	.catch(err => {
		res.status(500)
		res.json({
			error: err
		})
		return next()
	})
}

const logout = (req, res, next) => {
	dbInterface.deleteSession(req.cookies['sessionID'])
	.then(query => {
		console.log(queryResponse)
		res.json({
			logout: true
		})
		return next()
	})
	.catch(err => {
		res.json({
			error: err
		})
		res.status(500)
		return next()
	})
}

const verifySession = (req, res, next) => {
	return dbInterface.getSession(req.cookies['sessionID'])
	.then(query => {
		if (query.rows.length && 
				query.rows[0].user_id === Number.parseInt(req.params.id) &&
				Moment(query.rows[0].expires_at) > Moment()){
			return next()
		} else {
			res.status(400)
			res.json({
				error: 'invalid session',
			})
			return next(false)
		}
	})
}

server.post('/users/auth', login)
server.post('/users', createUser)
server.use(verifySession)
server.del('/users/auth', logout)
server.get('/users/:id', getUser)
// server.post('/users/:id/goals')
// server.get('/users:id/goals/:id')

server.get('/', (req, res, next) => {
	res.json({hey: 'there'})		
	return next()
})
