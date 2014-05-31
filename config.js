// Define all of the configurations that we want
module.exports = {
	rethinkdb: {
		'host': 'localhost',
		'port': 28015,
		'db': 'jetstream',
		'authKey': 'password', // TODO: make production-ready
		tables: {
			users: ['username'],
			chats: ['timestamp'],
			messages: ['chatId', 'timestamp', 'user']
		}
	},

	redis: {
		'host': '127.0.0.1',
		'port': 6868,
		'database': 0,
		'password': 'password' // TODO: make production-ready
	},

	port: process.env.PORT || 3000,
	root: __dirname,
	appName: 'JetStream',

	debug: true
};