var l = require('./log'),
    GooglePlusStrategy = require('passport-google-plus');

module.exports = function(app, passport) {
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });

    passport.use(new GooglePlusStrategy({
            clientId: '1597733950-19qdccarm1fo5ojrde7cemhgrufk9ef7.apps.googleusercontent.com',
            clientSecret: 'nAywumuXoegASLWuIV45RBWz'
        },
        function(tokens, profile, done) {
            l(profile.displayName, 'signed in!');
            // Create or update user, call done() when complete...
            done(null, profile, tokens);
        }));
};
