// Define all of the modules needed in the file
var l = require('./log'),
	io = require('socket.io'),
	db = require('./db'),
	config = require('./config'),
    express = require('express'),
    app = express(),
    swig = require('swig'),
    morgan = require('morgan');

app.use(morgan('dev'));

// Assign swig.renderFile to all .html files
app.engine('html', swig.renderFile);

// Set the default webpage file extension to .html
app.set('view engine', 'html');
app.set('views', config.root + '/server/views');

// Define public folders for our web app
app.use('/css', express.static(config.root + '/public/css'));
app.use('/js', express.static(config.root + '/public/js'));

// Run our router module to prepare for incoming requests
require(config.root + '/server/routes')(app);

// Open the ports for business
app.listen(config.port);
console.log('Server running on port', config.port);