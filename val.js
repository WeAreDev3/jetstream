// Makes sure all input from clients is in the right format and
// is for things they have access too.

//depends
var val = require('validator'),
    db = require('./db');

var def = {
    userPartOfChat: function (userid, chatid, callback) {
        db.rql(function (conn) {
            r.table('chats').get(chatid)('users').run(conn, function (err, res) {
                if (err) {
                    callback(err);
                } else {
                    if (res.indexOf(userid) >= 0) {
                        callback(null, true);
                    } else {
                        callback(null, false);
                    }
                }
            });
        });
    },
    areFriends: function (userList, callback) {
        /*  passes an object with properties being the 
            Id's of each user and the value being a list
            of users that they are not friends with
        */
        var errors = {},
            blackList = {},
            friendList = {},
            getUsersFriends = function (usr, runNext) {
                db.rql(function (conn) {
                    r.table('users').get(usr)('friends')
                    .run(conn, function (err, res) {
                        if (err) {
                            errors.usr = err;
                        } else {
                            friendList.usr = res;
                        }
                        if (runNext) {
                            popBlacklist();
                        }
                    });
                });
            },
            popBlacklist = function () {
                for (var person in friendList) {
                    blackList[person] = [];
                    for (var other in friendList) {
                        if (person !== other) {
                            if (friendList[person].indexOf(other) < 0) {
                                blackList[person].push(other);
                            }
                        }
                    }
                }
                callback(blackList);
            };
        for (var i = 0; i < userList.length; i++) {
            getUsersFriends(userList[i], i === userList.length - 1);
        }
    }
};

module.exports = def;