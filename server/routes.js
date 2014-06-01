var config = require('./../config');

module.exports = function(app) {
    // The homepage
    app.route('/').get(function (req, res) {
        res.render('index', {
            title: config.appName + ' - Home',
            appName: config.appName
        });
    });

    // Google+ authentication
    app.route('/auth/google/callback').post(function(req, res) {
        console.log(req.body);
    });

    app.route('/signin').get(function (req, res) {
        res.render('signin', {
            title: config.appName + ' - Sign In',
            appName: config.appName
        });
    });

    app.route('/app').get(function (req, res) {
        res.render('app', {
            title: config.appName,
            appName: config.appName
        });
    });
    
    // A catch-all (i.e. 404)
    app.route('*').all(function (req, res) {
        res.render('404', {
            title: config.appName + ' - 404',
            appName: config.appName
        });
    });
};