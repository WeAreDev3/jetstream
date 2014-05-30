// Define all of the configurations that we want
module.exports = {
	rethinkdb: {
		'host': 'localhost', // changes often
		'port': 28015,
		'db': 'jetstream',
		'authKey': 'password', // not prod ready
		'poolSize': 1,
		tables: {
			users: ['username'],
			chats: ['timestamp'],
			messages: ['chatId', 'timestamp']
		}
	},

	redis: {
		'host': 'localhost',
		'port': 6379,
		'database': 1,
		'password': 'password' // TODO: make production-ready
	},

	port: process.env.PORT || 3000,
	root: __dirname,
	appName: 'JetStream',

	debug: true
};