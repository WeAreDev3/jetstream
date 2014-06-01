var l = require('./log'),
    passport = require('passport'),
    GooglePlusStrategy = require('passport-google-plus');

l('Setting up Passport...');

module.exports = function(app) {
    passport.use(new GooglePlusStrategy({
        clientId: '1597733950-19qdccarm1fo5ojrde7cemhgrufk9ef7.apps.googleusercontent.com',
        apiKey: 'nAywumuXoegASLWuIV45RBWz'
    },
    function(tokens, profile, done) {
        l('Google+ Setup!');
        // Create or update user, call done() when complete...
        done(null, profile, tokens);
    }));
};
