// db defs

// depends
var redis = require('redis'),
    l = require('./log'),
    config = require('./config'),
    r = require('rethinkdb'),
    uuid = require('uuid'),
    val = require('validator');


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
    getOtherUserInfo: function(userid, callback) {
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
    getChatInfo: function(chatId, callback) {
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
        // userlist is list of user IDs
    	var addChatUser = function (userid, chatid, conn) {
    		r.table('users').get(userid).update({
    			chatList: r.row('chatList').append(chatid)
    		}).run(conn, function (err, result) {
                conn.close();
                i++;
    			if (err) {
                    error.push(err);
                } else if (i === j) {
                    if (error.length > 0) {
                        callback(error);
                    } else {
                        callback(null, result.generated_keys[0]);
                    }
                }
    		});
    	},
            error = [],
            j = 0,
            i = 0;
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
                        j++;
    				}
    			}
    		});
    	});
    },

    GoogUser: function (id, name, imgUrl, profUrl, fname, lname) {
        this.googId = id;
        this.googName = name;
        this.googImgUrl = imgUrl;
        this.googProfUrl = profUrl;
        this.googFname = fname;
        this.googLname = lname;
    },

    User: function (userOb, username, gender, language, timezone) {
        // takes either the GoogUser or JetstreamUser. init only
        userOb.username = username;
        userOb.blackList = [];
        userOb.requests = [];
        userOb.settings = {};
        userOb.gender = gender;
        userOb.language = language;
        userOb.timezone = timezone;
        userOb.chatList = [];
        userOb.timestamp = r.now();
        userOb.friends = [];
        return userOb;
    },

    JetstreamUser: function (fname, lname, passwd, slt) {
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

    Message: function (initUserId, chatId, message, tempId) {
        this.user = initUserId;
        this.chatId = chatId;
        this.message = message;
        this.id = uuid.v4();
        this.tempId = tempId;
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
                        delete message.tempId;
                        def.rql(function (err, conn) {
                            r.table('messages').insert(message)
                            .run(conn, function (err, result) {
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
    },

    getIdFromGoogId: function (googId, callback) {
        def.rql(function (conn) {
            r.table('users').getAll(googId, {index:'googId'}).run(conn, function (err, cursor) {
                if (err) {
                    callback(err);
                    cursor.close();
                    conn.close();
                } else {
                    cursor.toArray(function (err, list) {
                        cursor.close();
                        if (err) {
                            conn.close();
                            callback(err);
                        } else {
                            if (list.length != 1) {
                                callback(new Error('Problem with getIdFromGoogId'));
                                conn.close();
                            } else {
                                callback(null, list[0].id);
                                conn.close();
                            }
                        }
                    });
                }
            });
        });
    },
    isGoogleUser: function (googId, callback) {
        // reqs getIdFromGoogId function
        def.rql(function (conn) {
            r.table('users').getAll(googId, {index:'googId'}).count().run(conn, function (err, res) {
                conn.close();
                if (err) {
                    callback(err);
                } else {
                    if (res === 1) {
                        def.getIdFromGoogId(googId, function (uuid) {
                            callback(null, true, uuid);
                        });
                    } else if (res === 0) {
                        callback(null, false);
                    } else {
                        callback(new Error('Something went very wrong in the isGoogleUser function'));
                    }
                }
            });
        });
    },
    userInChat: function (userid, chatid, callback) {
        def.rql(function (conn) {
            r.table('chats').get(chatid)('users')
            .run(conn, function (err, result) {
                if (err) {
                    callback(err);
                } else {
                    if (result.indexOf(userid) >= 0) {
                        callback(null, true);
                    } else {
                        callback(null, false);
                    }
                }
                conn.close();
            });
        });
    },
    areFriends: function (userList, callback) {
        /*  passes an object with properties being the 
            Id's of each user and the value being a list
            of users that they are not friends with
        */
        var errors = {},
            blackList = {},
            friendList = {},
            i = 0,
            j = 0,
            getUsersFriends = function (usr, runNext) {
                db.rql(function (conn) {
                    r.table('users').get(usr)('friends')
                    .run(conn, function (err, res) {
                        j++;
                        if (err) {
                            errors.usr = err;
                        } else {
                            friendList.usr = res;
                        }
                        if (i === j) {
                            popBlacklist();
                        }
                    });
                });
            },
            popBlacklist = function () {
                for (var person in friendList) {
                    blackList[person] = [];
                    for (var other in friendList) {
                        if (person !== other) {
                            if (friendList[person].indexOf(other) < 0) {
                                blackList[person].push(other);
                            }
                        }
                    }
                }
                callback(null, blackList);
            };
        for (var user = 0; user < userList.length; i++) {
            getUsersFriends(userList[i], i === userList.length - 1);
            i++;
        }
    },
    getIdFromUsername: function (username, callback) {
        def.rql(function (conn) {
            r.table('users').getAll(username, {index: 'username'})
            .run(conn, function (err, cursor) {
                if (err) {
                    cursor.close();
                    conn.close();
                    callback(err);
                } else {
                    cursor.toArray(function (err, list) {
                        cursor.close();
                        conn.close();
                        if (err) {
                            callback(err);
                        } else {
                            callback(null, list[0].id);
                        }
                    });
                }
            });
        });
    },
    sendFriendRequest: function (fromId, toId, callback) {
        var fastData = {
            from: fromId,
            timestamp: (new Date()).toString()
            },
            rData = {
                from: fromId,
                timestamp: r.now()
            };
        def.rds.publish('request', fastData);
        def.requestExists(fromId, toId, function (err, bool, index) {
            if (err) {
                callback(err);
            } else {
                if (bool) {
                    def.rql(function (conn) {
                        r.table('users').get(toId)('requests')
                        .changeAt(index, rData).run(conn, function (err, res) {
                            if (err) {
                                callback(err);
                            } else {
                                callback(null, res);
                            }
                        });
                    });
                } else {
                    def.rql(function (conn) {
                        r.table('users').get(toId)('requests').append(rData)
                        .run(conn, function (err, res) {
                            conn.close();
                            if (err) {
                                callback(err);
                            } else {
                                callback(null, res);
                            }
                        });
                    });
                }
            }
        });
    },
    requestExists: function (fromId, toId, callback) {
        def.rql(function (conn) {
            r.table('users').get(toId)('requests')
            .run(conn, function (err, res) {
                conn.close();
                if (err) {
                    callback(err);
                } else {
                    var found = false,
                        index = null;
                    for (var request in res) {
                        if (res[request].from === fromId) {
                            found = true;
                            index = request;
                            break;
                        }
                    }
                    if (found) {
                        callback(null, true, index);
                    } else {
                        callback(null, false);
                    }
                }
            });
        });
    },
    isBlacklisted: function (potentialBlacklistee, normalGuy, callback) {
        def.rql(function (conn) {
            r.table('users').get(normalGuy)('blacklist')
            .run(conn, function (err, res) {
                if (err) {
                    callback(err);
                } else {
                    conn.close();
                    if (res.indexOf(potentialBlacklistee) >= 0) {
                        callback(null, true);
                    } else {
                        callback(null, false);
                    }
                }
            });
        });
    },
    getUserSettings: function (uuid, specific, callback) {
        if ((typeof specific) == 'string') {
            def.rql(function (conn) {
                r.table('users').get(uuid)('settings')(specific)
                .run(conn, function (err, result) {
                    conn.close();
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, result);
                    }
                });
            });
        } else {
            def.rql(function (conn) {
                r.table('users').get(uuid)('settings')
                .run(conn, function (err, result) {
                    if (err) {
                        specific(err);
                    } else {
                        specific(null, result);
                    }
                });
            });
        }
    },
    getUsersChats: function (uuid, callback) {
        def.rql(function (conn) {
            r.table('users').get(uuid)('chatList')
            .run(conn, function (err, resList) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, resList);
                }
            });
        });
    },
    getUsersFriends: function (uuid, callback) {
        def.rql(function (conn) {
            r.table('users').get(uuid)('friends')
            .run(conn, function (err, resList) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, resList);
                }
            });
        });
    },
    getUsernameFromGoogId: function (googId, callback) {
        def.rql(function (conn) {
            r.table('users').getAll(googId, {index: 'googId'})
            .run(conn, function (err, cursor) {
                if (err) {
                    cursor.close();
                    conn.close();
                    callback(err);
                } else {
                    cursor.toArray(function (err, list) {
                        cursor.close();
                        conn.close();
                        if (err) {
                            callback(err);
                        } else {
                            callback(null, list[0].username);
                        }
                    });
                }
            });
        });
    },
    isUsernameSet: function (uuid, callback) {
        def.rql(function (conn) {
            r.table('users').get(uuid)('username')
            .run(conn, function (err, theUsername) {
                conn.close();
                if (err) {
                    callback(err);
                } else {
                    if (theUsername) {
                        callback(null, true);
                    } else {
                        callback(null, false);
                    }
                }
            });
        });
    },
    setUsernamefromId: function (uuid, newUsername, callback) {
        if (val.isAlphanumeric(newUsername) && username.length != 0) {
            def.isUsernameSet(uuid, function (err, bool) {
                if (err) {
                    callback(err);
                } else {
                    if (bool) {
                        callback(null, false);
                    } else {
                        def.rql(function (conn) {
                            r.table('users').get(uuid).update({
                                username: newUsername
                            }).run(conn, function (err, res) {
                                conn.close();
                                if (err) {
                                    callback(err);
                                } else {
                                    callback(null, true);
                                }
                            });
                        });
                    }
                }
            });
        } else {
            callback(null, false);
        }
    },
    isUsernameTaken: function (username, callback) {
        def.rql(function (conn) {
            r.table('users').getAll(username, {index: 'username'})
            .count().run(conn, function (err, count) {
                conn.close();
                if (err) {
                    callback(err);
                } else {
                    if (count === 0) {
                        callback(null, false);
                    } else if (count === 1) {
                        callback(null, true);
                    } else {
                        l('something VERY bad happened. there are dup usernames');
                        callback(new Error('dup usernames:' + username));
                    }
                }
            });
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