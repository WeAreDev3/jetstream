// defines nice logs to have

var color = require('colors'),
	debug = require('./config').debug;

module.exports = {
	setupInfo: function () {
		def.creator('SetupInfo', 'magenta', arguments);
	},
	setupSuccess: function () {
		def.creator('SetupSuccess', 'green', arguments);
	},
	debug: function () { // should only be used to help debug
		if (debug) { // only if verbose
			def.creator('debug', 'yellow', arguments);
		} else {
			//
		};
	},

	dbConnError: function () {
		def.creator('DB conn error', 'red', arguments);
	},

	error: function () { // used for general bugs
		def.creator('error', 'magenta', arguments);
	},

	authError: function () { // any errors that have to do with auth
		def.creator('Auth error', 'magenta', arguments);
	},

	creator: function (tag, color, args) { // tryin to keep my logs dry
		console.log(('<' + tag + '>').bold.underline[color]);
		for (arg in args) {
			console.log(args[arg]);
		}
		console.log(('</' + tag + '>').italic[color]);
	}
}

var def = module.exports;