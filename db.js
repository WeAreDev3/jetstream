// db defs

// depends
var redis = require('redis'),
    l = require('./log'),
    config = require('./config'),
    r = require('rethinkdb'),
    uuid = require('uuid');


// def
var subscriber = createRdsConn();
subscriber.subscribe('messages');

var def = {
    rds: createRdsConn(),

    rdsSubscriber: subscriber,

    rql: function(callback) {
        r.connect({
            host: config.rethinkdb.host,
            port: config.rethinkdb.port,
            db: config.rethinkdb.db
        }, function(err, connection) {
            if (err) {
                l.dbConnError(err);
            } else {
                connection._id = Math.floor(Math.random() * 10001);
                callback(err, connection);
            }
        });
    },
    getUserInfo: function(username, callback) {
        def.rql(function(err, conn) {
            r.table('users').getAll(username, {
                index: 'username'
            }).run(conn, function(err, results) {
                conn.close();
                if (err) {
                    callback(err);
                } else {
                    callback(null, results);
                }
            });
        });
    },
    getConversationInfo: function(chatId, callback) {
        def.rql(function(err, conn) {
            r.table('chats').get(chatId)
                .run(conn, function(err, result) {
                    conn.close();
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, result);
                    }
                });
        });
    },
    getLastMessages: function(chatId, callback) {
        def.rql(function(err, conn) {
            r.table('messages').getAll(chatId, {
                index: 'chatId'
            }).orderBy(r.desc('timestamp')).limit(20)
                .run(conn, function(err, results) {
                    conn.close();
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, results);
                    }
                });
        });
    },

    createChat: function (name, userList, callback) {
    	var addChatUser = function (userid, chatid, conn) {
    		r.table('users').get(userid).update({
    			list: r.row('list').append(chatid)
    		}).run(conn, function (err, result) {
                conn.close();
    			if (err) {
                    callback(err);
                } else {
                    callback(null, result);
                }
    		});
    	};
    	def.rql(function (err, conn) {
    		r.table('chats').insert({
    			'users': userlist,
    			'name': name
    		}).run(conn, function (err, result) {
    			if (err) {
                    conn.close();
    				callback(err);
    			} else {
    				for (var user in userlist) {
    					addChatUser(userlist[user], result.generated_keys[0], conn);
    				}
    			}
    		});
    	});
    },

    User: function (username, email, password, fname, lname) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.firstName = fname;
        this.lastName = lname;
        this.timestamp = r.now();
    },

    createUser: function (newUser, callback) { // takes User
        def.rql(function (err, conn) {
            r.table('users').insert(newUser)
            .run(conn, function (err, result) {
                conn.close();
                if (err) {
                    callback(err);
                } else {
                    callback(null, result);
                }
            });
        });
    },

    Message: function (initUserName, initUserId, chatId, message) {
        this.username = initUserName;
        this.user = initUserId;
        this.chatId = chatId;
        this.message = message;
        this.id = uuid.v4();
    },

    createMessage: function (message, callback) { // takes Message
        var rmessage = JSON.stringify(message);
        def.rds.publish('messages', rmessage, function (err, res) {
            if (err) {
                callback(err);
                conn.close();
            } else {
                def.rds.set(message.id, rmessage, function (err, res) {
                    if (err) {
                        callback(err);
                        conn.close();
                    } else {
                        message.timestamp = r.now();
                        def.rql(function (err, conn) {
                            r.table('messages').insert(message).run(conn, function (err, result) {
                                conn.close();
                                if (err) {
                                    callback(err);
                                } else {
                                    callback(null, result);
                                }
                            });
                        });
                    }
                });
            }
        });
    }
};

// helpers
function createRdsConn () {
    var conn =  redis.createClient(config.redis.port, config.redis.host, {
        auth_pass: config.redis.password
    });
    return conn;
}
def.rds.on('ready', function () {
    l.info('redis connected');
});
def.rds.on('error', function (err) {
    l.error('redis error', err);
});

def.rdsSubscriber.on('error', function (err) {
    l.error('redis subscriber error', err);
});

module.exports = def;