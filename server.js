// Sever modules
var express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server),

    // Local modules
    config = require('./config'),
    db = require('./db'),
    val = require('./val'),
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

// Log every request
app.use(morgan('dev'));

// Set express to use cookies/sesions and parse POSTs
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

// IO authentication
io.use(passportSocketIo.authorize({
    cookieParser: cookieParser,
    key: 'connect.sid',
    secret: 'super secret',
    store: sessionStore,
    success: function(data, accept) {
        db.getIdFromGoogId(data.user.id, function (err, id) {
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
    socket.on('ready', function () {
        dbMessage.on('message', function (data) {
            db.userInChat(socket.user.uuid, data.chatId, function (err, bool) {
                if (err) {
                    //
                } else {
                    socket.emit('message', data);
                }
            });
        });
    });
    socket.on('getUserInfo', function (uuid) {
        db.getUserInfo(uuid, function (err, res) {
            if (err) {
                //
            } else {
                var giveToClient = {};
                giveToClient.username = res.username;
                giveToClient.googName = res.googName;
                giveToClient.googImgUrl = res.googImgUrl;
                socket.emit('getUserInfo', giveToClient);
            }
        });
    });
});

// Open the ports for business
server.listen(config.port);
l.info(config.appName, 'is running on port', config.port);
