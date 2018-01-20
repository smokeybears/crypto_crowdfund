require('dotenv').config()
let P = require('bluebird')
let dbInterface = require('./dbinterface')
let faker = require('faker')
let studyId = null 
let userId = null
dbInterface.createStudy('testing 1')
.then(insert => {
	studyId = insert.rows[0].id
})
.then(() => {
	// return dbInterface.createUser({phone: '1234567891', firstName: 'Test', lastName: 'Jones'})
})
.then(insert => {
	// userId = insert.rows[0].id
})
.then(() => {
	let prompts = []
	for (let i = 0; i < 100; i++){
		prompts.push(
			dbInterface.createPrompt(
				faker.lorem.sentences(Math.floor(Math.random() * 5 + 1)), 
				studyId,
				new Date())
			)
	}
	return P.all(prompts)
})
.then(prompts => {
	// for (prompt of prompts) {
	// 	dbInterface.createResponse(
	// 		faker.lorem.sentences(Math.floor(Math.random() * 6 + 1)), 
	// 		userId, 
	// 		prompt.rows[0].id
	// 	)
	// }		
})
.catch(err => {
	console.log(err)
})


