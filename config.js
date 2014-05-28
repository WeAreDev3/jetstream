// config file

// def
module.exports = {
	rethinkdb: {
		'host': 'localhost',
		'port': 28015,
		'db': 'test',
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