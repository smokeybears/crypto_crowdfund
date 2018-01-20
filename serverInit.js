const restify = require('restify')
const CookieParser = require('restify-cookies')
const bunyan = require('bunyan')
const server = restify.createServer({
	certificate: false,
	name: 'APU donate',
	version: '1.0.0'
	}, (sr) => {
		console.log("server created")
		console.log(sr)	
	})

server.use(restify.CORS({credentials: true}))
server.use(restify.bodyParser({mapParams: true}))
server.use(restify.queryParser())
server.use(CookieParser.parse)
server.on('after', restify.auditLogger({
	log: bunyan.createLogger({
		name: 'APU donate',
		stream: process.stdout
	})
}))


server.on('InternalServer', (req, res, route, err) => {
	console.log(err)
	return res.send(err)
})


server.on('uncaughtException', (req, res, route, err) => {
	console.log(err)
	return res.send(err.code || 500, {
		code: 500,
		error_description: err.status || err.message || err.description || "Internal Server Error",
		req: req.body
	})
})

server.listen('8090', () => {
	console.log(`server ${server.name} running on ${server.url}`)
})

process.on('uncaughtException', (err) => {
	console.log(err)
})


// var restify = require('restify');

// function respond(req, res, next) {
//   res.send('hello ' + req.params.name);
//   next();
// }

// var server = restify.createServer();
// server.get('/hello/:name', respond);
// server.head('/hello/:name', respond);

// server.listen(8080, function() {
//   console.log('%s listening at %s', server.name, server.url);
// });

module.exports = server
