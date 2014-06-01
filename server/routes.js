var config = require('../config'),
    l = require('../log'),
    googleapis = require('googleapis');


function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        req.authClient = new googleapis.OAuth2Client('1597733950-19qdccarm1fo5ojrde7cemhgrufk9ef7.apps.googleusercontent.com', 'nAywumuXoegASLWuIV45RBWz');
        req.authClient.credentials = req.session.googleCredentials;
        return next();
    }
    res.redirect('/signin')
}

module.exports = function(app, passport) {
    // The homepage
    app.route('/').get(ensureAuthenticated, function(req, res) {
        res.render('index', {
            title: config.appName,
            appName: config.appName
        });
    });

    // Google+ authentication
    app.route('/auth/google/callback').post(passport.authenticate('google'), function(req, res) {
        req.session.googleCredentials = req.authInfo;
        res.redirect('/');
    });

    app.route('/signin').get(function(req, res) {
        res.render('signin', {
            title: config.appName + ' - Sign In',
            appName: config.appName
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
