// defines nice logs to have

var color = require('colors');

module.exports = {
	dbError: function () { // when there is an error that isn't exactly fatal
		def.creator('DB error', 'magenta', arguments);
	},

	dbFatal: function () { // when there is an error that should NEVER happen
		def.creator('DB fatal error', 'red', arguments);
	},

	dbInfo: function () { // logs info that may be nice to have
		def.creator('DB info', 'cyan', arguments);
	},

	debug: function () { // should only be used to help debug
		def.creator('debug', 'yellow', arguments);
	},

	fatal: function () { // used for general fatal bugs
		def.creator('fatal error', 'red', arguments);
	},

	error: function () { // used for general bugs
		def.creator('error', 'magenta', arguments);
	},

	ioInfo: function () { // socket.io info
		def.creator('IO info', 'cyan', arguments)
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