// db defs

// depends
var redis = require('then-redis'),
    l = require('./log'),
    config = require('./config'),
    r = require('rethinkdb');

// def
module.exports = {
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
    }
}

var def = module.exports;
