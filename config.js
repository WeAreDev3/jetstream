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

    auth: {
        clientId: '1597733950-19qdccarm1fo5ojrde7cemhgrufk9ef7.apps.googleusercontent.com',
        clientSecret: 'nAywumuXoegASLWuIV45RBWz',
        callback: '/auth/callback'
    },

    port: process.env.PORT || 3000,
    root: __dirname,
    appName: 'JetStream',

    debug: true
};
