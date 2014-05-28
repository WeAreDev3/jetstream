// db defs

// depends
var rql = require('rql-promise'),
	redis = require('then-redis'),
	log = require('./log');

// def
module.exports = {
	placeholder: function () {
		console.log('placeholder');
	}
}

var def = module.exports;