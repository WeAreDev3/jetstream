// db defs

// depends
var rql = require('rql-promise'),
	redis = require('then-redis'),
	log = require('./log'),
	config = require('./config'),
	r = require('rethinkdb');

// def
module.exports = {
	getUserInfo: function (username) {
		rql(r.table('users').getAll(username, {index:'username'}))
		.then(function (result) {
			console.log('ok', result)
			if (result.length === 0) {
				;//
			};
			return result;
		}, function (err) {
			console.log('err', err)
			throw err;
		});
	}
}

rql.connect({ // connect to db with connection pool
	host: config.rethinkdb.host,
	port: config.rethinkdb.port,
	db: config.rethinkdb.db,
	//authKey: '',
	maxPoolSize: config.rethinkdb.poolSize
});

var def = module.exports;