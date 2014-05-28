// config file

// def
module.exports = {
	rethinkdb: {
		'host': '192.168.1.77',
		'port': 28015,
		'db': 'test',
		'authKey': 'password', // not prod ready
		'poolSize': 20,
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