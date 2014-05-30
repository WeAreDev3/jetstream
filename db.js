// db defs

// depends
var redis = require('then-redis'),
    l = require('./log'),
    config = require('./config'),
    r = require('rethinkdb');

// def
var rd = redis.createClient({
    host: config.redis.host,
    port: config.redis.port,
    database: config.redis.db,
    password: config.redis.password
})
var def = {
    rql: function(callback) {
        r.connect({
            host: config.rethinkdb.host,
            port: config.rethinkdb.port,
            db: config.rethinkdb.db
        }, function(err, connection) {
            if (err) {
                l.dbConnError(err)
            } else {
                connection['_id'] = Math.floor(Math.random() * 10001);
                callback(err, connection);
            };
        });
    },
    getUserInfo: function(username, callback) {
        def.rql(function(err, conn) {
            r.table('users').getAll(username, {
                index: 'username'
            })
                .run(conn, function(err, results) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, results);
                    };
                })
        })
    },
    getConversationInfo: function(chatId, callback) {
        def.rql(function(err, conn) {
            r.table('chats').get(chatId)
                .run(conn, function(err, result) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, result);
                    };
                })
        })
    },
    getLastMessages: function(chatId, callback) {
        def.rql(function(err, conn) {
            r.table('messages').getAll(chatId, {
                index: 'chatId'
            }).orderBy(r.desc('timestamp')).limit(20)
                .run(conn, function(err, results) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, results);
                    };
                })
        })
    },

    createChat: function (name, userList, callback) {
    	var addChatUser = function (userid, chatid) {
    		r.table('users').get(userid).update({
    			list: r.row('list').append(chatid)
    		}).run(conn, function (err, result) {
    			// body...
    		})
    	}
    	def.rql(function (err, conn) {
    		r.table('chats').insert({
    			'users': userlist,
    			'name': name
    		}).run(conn, function (err, result) {
    			if (err) {
    				callback(err);
    			} else {
    				for (var user in userlist) {
    					addChatUser(userlist[user], result["generated_keys"][0]);
    				}
    			};
    		})
    	})
    },

    User: function (username, email, password, fname, lname) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.firstName = fname;
        this.lastName = lname;
        this.timestamp = r.now();
    },

    createUser: function (newUser, callback) { // takes User constructor
        def.rql(function (err, conn) {
            r.table('users').insert(newUser)
            .run(conn, function (err, result) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, result);
                };
            })
        })
    }
}

module.exports = def;