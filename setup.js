// sets up the DBs. ONLY RUN ONCE


// depends
var r = require('rethinkdb'),
    config = require('./config'),
    l = require('./log'),
    redis = require('then-redis'),
    db = require('./db');

var i = 0,
    j = 0;
// sets up server
db.rql(function(err, conn) {
    r.dbCreate(config.rethinkdb.db)
    .run(conn, function(err, result) {
        if (err) {
            l.setupInfo('Potential Error', err);
        } else {
        	l.setupSuccess(result, 'DB: ' + config.rethinkdb.db);
        }
        for (var table in config.rethinkdb.tables) {
            (function(tbl) {
                r.tableCreate(tbl)
                    .run(conn, function(err, result) {
                        if (err) {
                            l.setupInfo('Potential Error', err);
                        } else {
                        	l.setupSuccess(result, 'TBL: ' + tbl);
                    	}
                        for (var index in config.rethinkdb.tables[tbl]) {
                            (function(inx) {
                                r.table(tbl)
                                    .indexCreate(config.rethinkdb.tables[tbl][inx])
                                    .run(conn, function(err, result) {
                                        if (err) {
                                            l.setupInfo('Potential Error', err);
                                        } else {
                                            l.setupSuccess(result, "INX: " + config.rethinkdb.tables[tbl][inx]);
                                        }
                                        j++;
                                        if (j === i) {
                                            throw l.info("Rethinkdb configured successfully! Killing node...");
                                        }
                                    });
                            })(index);
                        }
                    });
            })(table);
        }
    });
});

for (var table in config.rethinkdb.tables) {
    for (var index in config.rethinkdb.tables[table])  {
        i++;
    }
}