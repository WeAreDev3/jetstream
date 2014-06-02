// Sever modules
var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io')(server),

    // Local modules
    config = require('./config'),
    db = require('./db'),
    val = require('./val'),
    l = require('./log'),

    // Middleware/template/helper modules
    swig = require('swig'),
    passport = require('passport'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session');

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
    secret: 'super secret'
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
db.rdsSubscriber.on('message', function(channel, message) {
    l('channel: ' + channel);
    l('message: ', db.redisStringToObject(message));
});

// socket.io
io.on('connection', function(socket) {
    l.info('User connected:', socket.id);
    socket.on('disconnect', function() {
        l('User disconnected:', socket.id);
    });
});

// Open the ports for business
server.listen(config.port);
l.info(config.appName, 'is running on port', config.port);
