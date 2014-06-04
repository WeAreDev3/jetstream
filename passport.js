var GooglePlusStrategy = require('passport-google-plus'),
    l = require('./log'),
    config = require('./config'),
    db = require('./db');

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
            db.isGoogleUser(profile.id, function (err, is, id) {
                if (err) {
                    l('here it is..', err);
                } else {
                    if (is) {
                        l(profile.displayName, 'already exists')
                        profile.uuid = id;
                    } else {
                        var newUser = new db.GoogUser(profile.id,
                            profile.displayName, profile.image.url,
                            profile.url, profile.name.givenName,
                            profile.name.familyName);
                        newUser = new db.User(newUser,
                            profile.gender ? profile.gender : null,
                            profile.language ? profile.language : null,
                            null);
                        db.createUser(newUser, function (err, result) {
                            if (err) {
                                l('User failed to create');
                            } else {
                                l('Created new user:', profile.displayName + '!');
                            }
                        });
                    }
                }
            });
            l(profile.displayName, 'signed in with Passport!');
            // Create or update user, call done() when complete...
            done(null, profile, tokens);
        }));
};
