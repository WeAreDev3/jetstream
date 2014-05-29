// Define all of the configurations that we want
module.exports = {
	rethinkdb: {
		'host': '10.225.10.7', // changes often
		'port': 28015,
		'db': 'test',
		'authKey': 'password', // not prod ready
		'poolSize': 1,
		tables: ['users']
	},

	redis: {
		'host': 'localhost',
		'port': 6379,
		'database': 1,
		'password': 'password' // TODO: make production-ready
	},

	port: process.env.PORT || 3000,
	root: __dirname,
	appName: 'NEAR Stack',

	debug: true
}