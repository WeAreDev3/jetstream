var GooglePlusStrategy = require('passport-google-plus'),
    l = require('./log'),
    config = require('./config');

module.exports = function(app, passport) {
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });

    passport.use(new GooglePlusStrategy({
            clientId: config.auth.clientId,
            clientSecret: config.auth.clientSecret
        },
        function(tokens, profile, done) {
            l(profile.displayName, 'signed in with Passport!');
            // Create or update user, call done() when complete...
            done(null, profile, tokens);
        }));
};
