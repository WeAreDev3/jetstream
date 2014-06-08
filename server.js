// Sever modules
var express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server),

    // Local modules
    config = require('./config'),
    db = require('./db'),
    l = require('./log'),

    // Middleware/template/helper modules
    swig = require('swig'),
    events = require('events'),
    passport = require('passport'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    sessionStore = new session.MemoryStore(),
    passportSocketIo = require('passport.socketio');

// Define public folders for our web app
app.use(express.static(config.root + '/public'));
app.use(express.static(config.root + '/public/css'));
app.use(express.static(config.root + '/public/js'));
app.use('fonts', express.static(config.root + '/fonts'));

// Log every request
app.use(morgan('dev'));

// Set express to use cookies/sessions and parse POSTs
app.use(cookieParser());
app.use(bodyParser());
app.use(session({
    key: 'connect.sid',
    secret: 'super secret',
    store: sessionStore
}));

// Assign swig.renderFile to all .html files
app.engine('html', swig.renderFile);

// Set the default webpage file extension to .html
app.set('view engine', 'html');
app.set('views', config.root + '/server/views');

if (config.debug) {
    // To disable Swig's cache
    app.set('view cache', false);
    swig.setDefaults({
        cache: false
    });
}

// Init Passport and set it to use sessions
app.use(passport.initialize());
app.use(passport.session());

// Setup Passport
require('./passport')(app, passport);

// Run our router module to prepare for incoming requests
require(config.root + '/server/routes')(app, passport);

// db listener
var dbMessage = new events.EventEmitter();
dbMessage.setMaxListeners(0);
db.rdsSubscriber.on('message', function(channel, message) {
    dbMessage.emit('message', db.redisStringToObject(message));
});
db.rdsSubscriber.on('request', function(channel, data) {
    // body...
});

// IO authentication
io.use(passportSocketIo.authorize({
    cookieParser: cookieParser,
    key: 'connect.sid',
    secret: 'super secret',
    store: sessionStore,
    success: function(data, accept) {
        db.getIdFromGoogId(data.user.id, function(err, id) {
            if (err) {
                l(err);
            } else {
                data.user.uuid = id;
                l(data.user.displayName, 'is authenticated with Socket.IO');
                accept(null, true);
            }
        });
    },
    fail: function(data, message, error, accept) {
        l('IO user is not authenticated:', data.id);
    }
}));

// socket.io
io.on('connection', function(socket) {
    l(socket.user.displayName, 'connected to Socket.IO:');
    socket.on('disconnect', function() {
        l('User disconnected:', socket.user.displayName);
    });
    socket.once('ready', function() {
        l(socket.user.displayName, 'is ready');
        dbMessage.on('message', function(data) {
            db.userInChat(socket.user.uuid, data.chatId, function(err, bool) {
                if (err) {
                    //
                } else {
                    socket.emit('message', data);
                }
            });
        });
    });
    socket.on('getUserInfo', function(uuid) {
        db.isBlacklisted(socket.user.uuid,
            uuid, function(err, bool) {
                if (err) {
                    socket.emit('getUserInfo', {
                        uuid: data.tempId,
                        error: 'Chat did not exist'
                    });
                } else {
                    if (bool) {
                        var giveToClient = {
                            id: uuid,
                            found: false
                        };
                        socket.emit('getUserInfo', giveToClient);
                    } else {
                        db.getUserInfo(uuid, function(err, res) {
                            if (err) {
                                //
                            } else {
                                var giveToClient = {
                                    id: res.id,
                                    username: res.username,
                                    googName: res.googName,
                                    googImgUrl: res.googImgUrl,
                                    found: true
                                };
                                socket.emit('getUserInfo', giveToClient);
                            }
                        });
                    }
                }
            });
    });
    socket.on('message', function(data) {
        l(socket.user.displayName, 'sent a message:', data);
        db.userInChat(socket.user.uuid, data.chatId, function(err, bool) {
            if (err) {
                if (err.message === 'Cannot perform get_field on a non-object non-sequence `null`.') {
                    socket.emit('message', {
                        tempId: data.tempId,
                        error: 'Chat did not exist'
                    });
                } else { // catch all
                    socket.emit('message', {
                        tempId: data.tempId,
                        error: err
                    });
                }
            } else {
                if (bool) {
                    var newMessage = new db.Message(socket.user.uuid,
                        data.chatId, data.message, data.tempId);
                    db.createMessage(newMessage, function (err, res) {
                        if (err) {
                            if (false) {
                                //
                            } else { // catch all
                                socket.emit('message', {
                                    tempId: data.tempId,
                                    error: err
                                });
                            }
                        }
                    });
                }
            }
        });
    });
    socket.on('createChat', function(data) {
        db.areFriends(data.users, function(err, ob) {
            var sendFriendRequests = function (person, nonfriend) {
                db.sendFriendRequest(person,
                    nonfriend,
                    function (err, res) {
                        if (err) {
                            // handle
                        } else {
                            socket.emit('createChat', {
                                tempId: data.tempId,
                                mustFriend: [person, nonfriend]
                            });
                        }
                    }
                );
            },
                isBlacklistedLooper = function(person, nonfriend) {
                    db.isBlacklisted(person, nonfriend,
                        function(err, bool) {
                            if (err) {
                                socket.emit('createChat', {
                                    tempId:data.tempId,
                                    dbError: err
                                });
                            } else {
                                if (bool) {
                                    socket.emit('createChat', {
                                        tempId: data.tempId,
                                        blocked: {
                                            blocker: person,
                                            blockee: nonfriend
                                        }
                                    });
                                } else {
                                    sendFriendRequests(person, nonfriend);
                                }
                            }
                        }
                    );
                };
            if (Object.keys(ob).length === 0) {
                db.createChat(data.name, data.users, function(err, chatId) {
                    if (err) {
                        //
                    } else {
                        var chatConfirm = {
                            name: data.name,
                            id: chatId,
                            tempId: tempId
                        };
                        socket.emit('createChat', chatConfirm);
                    }
                });
            } else { // not all participants are friends
                for (var person in ob) {
                    for (var nonfriend in ob[person]) {
                        isBlacklistedLooper(person, ob[pserson][nonfriend]);
                    }
                }
            }
        });
    });
    socket.on('getIdFromUsername', function(username) {
        db.getIdFromUsername(username, function(err, uuid) {
            if (err) {
                // handle it
            } else {
                db.isBlacklisted(socket.user.uuid, uuid, function(err, bool) {
                    if (err) {
                        //handle it
                    } else {
                        if (bool) {
                            socket.emit('getIdFromUsername', {
                                username: username,
                                found: false
                            });
                        } else {
                            socket.emit('getIdFromUsername', {
                                username: username,
                                found: true
                            });
                        }
                    }
                });
            }
        });
    });
    socket.on('userSettings', function (specific) {
        if (specific) {
            db.getUserSettings(socket.user.uuid,
                specific, function (err, result) {
                    if (err) {
                        // handle it
                    } else {
                        var giveSettings = {
                            specific: specific,
                            settings: result
                        };
                        socket.emit('userSettings', giveSettings);
                    }
                });
        } else {
            db.getUserSettings(socket.user.uuid, function (err, res) {
                if (err) {
                    // handle it
                } else {
                    var giveSettings = {
                        specific: null,
                        settings: res
                    };
                    socket.emit('userSettings', giveSettings);
                }
            });
        }
    });
    socket.on('getUsersChats', function () {
        db.getUsersChats(socket.user.uuid, function (err, resList) {
            if (err) {
                // handle it
            } else {
                socket.emit('getUsersChats', resList);
            }
        });
    });
});

// Open the ports for business
server.listen(config.port);
l.info(config.appName, 'is running on port', config.port);
