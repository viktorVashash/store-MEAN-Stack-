"use strict";

var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var passport = require('passport');
var loger = require('morgan');
var path = require('path');
var app = express();
var Session = require('express-session');
var session;
var MemoryStore = require('connect-mongo')(Session);
var sessionConfig;
var mongoose = require('mongoose');
var configs;
var connectOptions;
var db;

// app.use(cookieSession({keys: ['secret']}));
// app.use(passport.initialize());
// app.use(passport.session());

require("jsdom").env("", function (err, window) {
    if (err) {
        console.error(err);
        return;
    }

    var $ = require("jquery")(window);
});

require('./models/index');

process.env.NODE_ENV = process.env.NODE_ENV || 'develop';

configs = require('./config/' + process.env.NODE_ENV);
connectOptions = configs.mongoConfig;

app.use(express.static(__dirname + '/public'));

app.use(loger('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

db = mongoose.createConnection(process.env.DB_HOST, process.env.DB_NAME, process.env.DB_PORT, connectOptions);
db.on('error', function (error) {
    throw error;
});
db.once('open', function callback() {
    console.log('Connection to database is success');

    sessionConfig = configs.sessionConfig(db);

    app.db = db;

    session = Session({
        name: 'storeDB',
        key: 'storeDB',
        secret: '123abc',
        resave: false,

        cookie: {
            maxAge: 365 * 24 * 60 * 60 * 1000
        },

        rolling: true,
        saveUninitialized: true,
        store: new MemoryStore(sessionConfig)
    });

    app.use(session);

    require('./routes/')(app);

    app.listen(process.env.PORT, function () {
        console.log('Server successfully started: ' + process.env.PORT);
    })
});
