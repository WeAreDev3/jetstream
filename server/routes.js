var config = require('../config'),
    l = require('../log'),
    db = require('../db'),
    googleapis = require('googleapis');


function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        req.authClient = new googleapis.OAuth2Client(config.auth.clientId, config.auth.clientSecret);
        req.authClient.credentials = req.session.googleCredentials;
        return next();
    }
    res.redirect('/signin');
}

function hasUsername (req, res, next) {
    db.getUsernameFromGoogId(req.user.id, function(error, username) {
        l(username);
        if (username) {
            next();
        } else {
            res.render('setUpUsername', {
                appName: config.appName,
                title: 'Set Up a Username',
                user: req.user,
                assets: {
                    css: ['setUpUsername.css'],
                    js: ['/socket.io/socket.io.js', 'validator-js/validator.min.js', 'setUpUsername.js']
                }
            });
        }
    });
}

module.exports = function(app, passport) {
    // The homepage
    app.route('/').get(ensureAuthenticated, hasUsername, function(req, res) {
        res.render('app', {
            appName: config.appName,
            title: 'Home',
            user: req.user,
            assets: {
                css: ['http://fonts.googleapis.com/css?family=Open+Sans:400,300,700,800|Grand+Hotel', 'app.css', 'main.css'],
                js: ['/socket.io/socket.io.js', 'main.js', 'app.js']
            }
        });
    });

    // Google+ authentication
    app.route(config.auth.callback).get(passport.authenticate('google'), function(req, res) {
        req.session.googleCredentials = req.authInfo;
        res.redirect('/');
    });

    app.route('/signin').get(function(req, res) {
        res.render('signin', {
            appName: config.appName,
            title: 'Sign In',
            auth: config.auth,
            assets: {
                css: ['http://fonts.googleapis.com/css?family=Open+Sans:400,300,700|Grand+Hotel', 'signin.css'],
                js: ['signin.js']
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
