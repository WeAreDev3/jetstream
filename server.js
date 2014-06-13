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
app.use(express.static(config.root + '/public/bower_components'));
app.use(express.static(config.root + '/public/html'));
app.use('/fonts', express.static(config.root + '/fonts'));

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
    l(socket.user.displayName, 'connected to Socket.IO');
    socket.once('ready', function() {
        socket.emit('ready', socket.user);
        dbMessage.on('message', function(data) {
            l('listener created?');
            db.userInChat(socket.user.uuid, data.chatId, function(err, bool) {
                if (err) {
                    socket.emit('message', data.chatId, err, data);
                } else {
                    if (bool) {    
                        socket.emit('message', data.chatId, null, data);
                    }
                }
            });
        });
    });
    socket.on('getOtherUserInfo', function(uuid, scope) {
        db.isBlacklisted(socket.user.uuid, uuid, function(err, bool) {
                if (err) {
                    socket.emit('getOtherUserInfo', uuid, err, scope);
                } else {
                    if (bool) {
                        socket.emit('getOtherUserInfo', uuid, scope);
                    } else {
                        db.getOtherUserInfo(uuid, function(err, res) {
                            if (err) {
                                socket.emit('getOtherUserInfo', uuid, err, scope);
                            } else {
                                socket.emit('getOtherUserInfo', uuid, null,
                                    scope, res);
                            }
                        });
                    }
                }
            });
    });
    socket.on('sendMessage', function(tempId, data) {
        db.userInChat(socket.user.uuid, data.chatId, function(err, bool) {
            if (err) {
                if (err.message === 'Cannot perform get_field on a non-object non-sequence `null`.') {
                    socket.emit('sendMessage', tempId, err, 'Chat does not exist');
                } else { // catch all
                    socket.emit('sendMessage', tempId, err);
                }
            } else {
                if (bool) {
                    var newMessage = new db.Message(socket.user.uuid,
                        data.chatId, data.message, tempId);
                    db.createMessage(newMessage, function(err, res) {
                        if (err) {
                            socket.emit('sendMessage', tempId, err);
                        } else {
                            socket.emit('sendMessage', tempId, null, res);
                        }
                    });
                }
            }
        });
    });
    socket.on('createChat', function(tempId, data) {
        data.users.push(socket.user.uuid);

        db.areFriends(data.users, function(err, ob) {
            var sendFriendRequests = function(person, nonfriend) {
                db.sendFriendRequest(person,
                    nonfriend,
                    function(err, res) {
                        if (err) {
                            socket.emit('createChat', tempId, err);
                        } else {
                            socket.emit('createChat', tempId, null,
                                null, // no chat created
                                [person, nonfriend] // friend conflict
                            );
                        }
                    }
                );
            },
                isBlacklistedLooper = function(person, nonfriend) {
                    db.isBlacklisted(person, nonfriend,
                        function(err, bool) {
                            if (err) {
                                socket.emit('createChat', tempId, err);
                            } else {
                                if (bool) {
                                    socket.emit('createChat', tempId,
                                        null, // no error
                                        null, // the chat was not created, so no id
                                        [person, nonfriend]);// the blacklist conflict
                                } else {
                                    sendFriendRequests(person, nonfriend);
                                }
                            }
                        }
                    );
                };
                
                l('check friends');

                if (Object.keys(ob).length === 0) {
                    db.createChat(data.name, data.users, function(err, chatId) {
                        if (err) {
                            socket.emit('createChat', tempId, err);
                        } else {
                            socket.emit('createChat', tempId, null, chatId);
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
                socket.emit('getIdFromUsername', username, err, null);
            } else {
                db.isBlacklisted(socket.user.uuid, uuid, function(err, bool) {
                    if (err) {
                        socket.emit('getIdFromUsername', username, err, null);
                    } else {
                        if (bool) {
                            socket.emit('getIdFromUsername', username, null,
                                        null);
                        } else {
                            socket.emit('getIdFromUsername', username, null, uuid);
                        }
                    }
                });
            }
        });
    });
    socket.on('userSettings', function(specific) {
        if (specific) {
            db.getUserSettings(socket.user.uuid,
                specific, function(err, result) {
                    if (err) {
                        socket.emit('userSettings', specific, err, null);
                    } else {
                        socket.emit('userSettings', specific, null, res);
                    }
                });
        } else {
            db.getUserSettings(socket.user.uuid, function(err, res) {
                if (err) {
                    socket.emit('userSettings', null, err, null);
                } else {
                    socket.emit('userSettings', null, null, res);
                }
            });
        }
    });
    socket.on('getUsersFriends', function() {
        db.getUsersFriends(socket.user.uuid, function(err, resList) {
            if (err) {
                socket.emit('getUsersFriends', null, err, null);
            } else {
                socket.emit('getUsersFriends', null, null, resList);
            }
        });
    });
    socket.on('getUsersChats', function() {
        db.getUsersChats(socket.user.uuid, function(err, resList) {
            if (err) {
                socket.emit('getUsersChats', null, err, null);
            } else {
                socket.emit('getUsersChats', null, null, resList);
            }
        });
    });
    socket.on('getChatInfo', function(chatId) {
        db.getChatInfo(chatId, function(err, info) {
            if (err) {
                socket.emit('getChatInfo', chatId, err, null);
            } else {
                socket.emit('getChatInfo', chatId, null, info);
            }
        });
    });
    socket.on('setUsernamefromId', function(username) {
        db.isUsernameTaken(username, function(err, bool) {
            if (err) {
                socket.emit('setUsernamefromId', username, err, null);
            } else {
                if (bool) {
                    socket.emit('setUsernamefromId', username, null, false);
                } else {
                    db.setUsernamefromId(socket.user.uuid, username, function(err, bool) {
                        if (err) {
                            socket.emit('setUsernamefromId', username, err, null);
                        } else {
                            socket.emit('setUsernamefromId', username, null, bool);
                        }
                    });
                }
            }
        });
    });
    socket.on('isUsernameTaken', function(username) {
        db.isUsernameTaken(username, function(err, bool) {
            if (err) {
                socket.emit('isUsernameTaken', username, err, null);
            } else {
                socket.emit('isUsernameTaken', username, null, bool);
            }
        });
    });
    socket.on('sendFriendRequest', function(toId) {
        db.sendFriendRequest(socket.user.uuid, toId, function(err, updated, response) {
            if (err) {
                socket.emit('sendFriendRequest', toId, err, null, null);
            } else {
                socket.emit('sendFriendRequest', toId, null, updated, response);
            }
        });
    });
    socket.on('acceptFriendRequest', function(toId) {
        // need to get db function
    });
    socket.on('getUsersFriendRequests', function() {
        db.getUsersFriendRequests(socket.user.uuid, function(err, friendRequests) {
            if (err) {
                socket.emit('getUsersFriendRequests', null, err);
            } else {
                socket.emit('getUsersFriendRequests', null, null, friendRequests);
            }
        });
    });
});

// Open the ports for business
server.listen(config.port);
l.info(config.appName, 'is running on port', config.port);
