// db defs

// depends
var redis = require('then-redis'),
    log = require('./log'),
    config = require('./config'),
    r = require('rethinkdb');

// def
module.exports = {
    getUserInfo: function(username) {
    	; // idk, we're using callback async now
    },
    onConnect: function(callback) {
        r.connect({
            host: config.rethinkdb.host,
            port: config.rethinkdb.port,
            db: config.rethinkdb.db
        }, function(err, connection) {
            assert.ok(err === null, err);
            connection['_id'] = Math.floor(Math.random() * 10001);
            callback(err, connection);
        });
    }
}

var def = module.exports;
