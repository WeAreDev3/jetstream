// defines nice logs to have

var color = require('colors'),
    debug = require('./config').debug;


function logger(tag, color, args) {
    var logs = Array.prototype.slice.call(args),
        logTag = '[' + tag + ']',
        logMessage = [logTag[color]].concat(logs);

    console.log.apply(console, logMessage);
}

module.exports = function() {
    var self = module.exports,
        args = Array.prototype.slice.call(arguments);

    self.debug.apply(self, args);
};

module.exports.debug = function() {
    if (debug) {
        logger('debug', 'yellow', arguments);
    }
};

module.exports.info = function() {
    logger('info', 'blue', arguments);
};

module.exports.error = function() {
    logger('error', 'red', arguments);
};

module.exports.setupInfo = function() {
    logger('setupInfo', 'magenta', arguments);
};

module.exports.setupSuccess = function() {
    logger('setupSuccess', 'green', arguments);
};

module.exports.dbConnError = function() {
    logger('dbConnError', 'red', arguments);
};

module.exports.authError = function() {
    logger('authError', 'magenta', arguments);
};
