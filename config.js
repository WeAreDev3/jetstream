// config file

// def
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
		'database': 1, // can this be a string???
		'password': 'password' // not prod ready
	},

	debug: true // crazy much info
}