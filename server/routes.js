var config = require('./../config');

module.exports = function(app) {
    // The homepage
    app.route('/').get(function (req, res) {
        res.render('index', {
            title: config.appName,
            appName: config.appName
        });
    });
    
    // A catch-all (i.e. 404)
    app.route('*').all(function (req, res) {
        res.render('404', {
            title: 'NEAR Stack - 404',
            appName: config.appName
        });
    });
};