var config = require('../config'),
    l = require('../log'),
    googleapis = require('googleapis');


function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        req.authClient = new googleapis.OAuth2Client(config.auth.clientId, config.auth.clientSecret);
        req.authClient.credentials = req.session.googleCredentials;
        return next();
    }
    res.redirect('/signin');
}

module.exports = function(app, passport) {
    // The homepage
    app.route('/').get(ensureAuthenticated, function(req, res) {
        res.render('index', {
            appName: config.appName,
            title: 'Home',
            auth: config.auth,
            user: req.user
        });
    });

    // Google+ authentication
    app.route(config.auth.callback).get(passport.authenticate('google'), function(req, res) {
        req.session.googleCredentials = req.authInfo;
        res.redirect('/app');
    });

    app.route('/signin').get(function(req, res) {
        res.render('signin', {
            title: config.appName + ' - Sign In',
            appName: config.appName
        });
    });

    app.route('/app').get(ensureAuthenticated, function(req, res) {
        res.render('app', {
            appName: config.appName,
            title: config.appName,
            auth: config.auth,
            user: req.user,
            assets: {
                css: ['http://fonts.googleapis.com/css?family=Open+Sans:400,300,700,800|Grand+Hotel', 'app.css'],
                js: ['/socket.io/socket.io.js', 'main.js', 'app.js']
            }
        });
    });

    // A catch-all (i.e. 404)
    app.route('*').all(function(req, res) {
        res.render('404', {
            title: config.appName + ' - 404',
            appName: config.appName
        });
    });
};
