// 'command' file

//depends
var log = require('./log'),
	io = require('socket.io'),
	mach = require('mach'),
	db = require('./db'),
	config = require('./config');

// server
log.debug(db.getUserInfo('tester'));