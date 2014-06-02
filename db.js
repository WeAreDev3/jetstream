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
                callback(connection);
            }
        });
    },
    getUserInfo: function(userid, callback) {
        def.rql(function(conn) {
            r.table('users').get(userid)
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
    getConversationInfo: function(chatId, callback) {
        def.rql(function(conn) {
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
        def.rql(function(conn) {
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
    			chatList: r.row('chatList').append(chatid)
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
    			'name': name,
                'timestamp': r.now()
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

    GoogUser: function (id, name, imgUrl, profUrl) {
        this.googId = id;
        this.googName = name;
        this.googImgUrl = imgUrl;
        this.googProfUrl = profUrl;
    },

    User: function (userOb, gender, language, timezone) {
        // takes either the GoogUser or JetstreamUser. init only
        userOb.gender = gender;
        userOb.language = language;
        userOb.timezone = timezone;
        userOb.chatList = [];
        userOb.timestamp = r.now();
        userOb.friends = [];
        return userOb;
    },

    JetstreamUser: function (usrnm, fname, lname, passwd, slt) {
        this.username = usrnm;
        this.firstName = fname;
        this.lastName = lname;
        this.password = passwd;
        this.salt = slt;
    },

    createUser: function (newUser, callback) {
        // Takes User ONLY
        def.rql(function (conn) {
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
        var rmessage = message;
        rmessage.timestamp = new Date();
        rmessage.timestamp = rmessage.timestamp.toString();
        rmessage = JSON.stringify(rmessage);
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
    },

    redisStringToObject: function (string) {
        ob = JSON.parse(string);
        ob.timestamp = new Date(ob.timestamp);
        return ob;
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