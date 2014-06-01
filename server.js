// Define all of the modules needed in the file
var l = require('./log'),
    io = require('socket.io'),
    db = require('./db'),
    config = require('./config'),
    express = require('express'),
    app = express(),
    swig = require('swig'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    val = require('./val');

// Define public folders for our web app
app.use(express.static(config.root + '/public'));
app.use(express.static(config.root + '/public/css'));
app.use(express.static(config.root + '/public/js'));

// Log every request
app.use(morgan('dev'));

// Parse information from POSTs
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

// Init Passport
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

// Open the ports for business
app.listen(config.port);
l.info(config.appName, 'is running on port', config.port);
