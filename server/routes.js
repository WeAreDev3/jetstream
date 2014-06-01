var config = require('./../config');

module.exports = function(app) {
    // The homepage
    app.route('/').get(function (req, res) {
        res.render('index', {
            title: config.appName,
            appName: config.appName
        });
    });

    app.route('/auth/google/callback').post(function(req, res) {
        console.log(req.body);
    });
    
    // A catch-all (i.e. 404)
    app.route('*').all(function (req, res) {
        res.render('404', {
            title: config.appName + ' - 404',
            appName: config.appName
        });
    });
};