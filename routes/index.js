'use strict';

module.exports = function (app) {
    var userRouter = require('./user')(app);
    var productRouter = require('./product')(app);
    var categoryRouter = require('./category')(app);
    var CONSTANTS = require('../constants/mainConstants');

    var sessionValidator = function (req, res, next) {
        var session = req.session;

        session.cookie.maxAge = CONSTANTS.SESSION_TTL;

        next();
    };

    app.use(sessionValidator);

    app.get('/', function (req, res, next) {
        res.sendFile('/Users/viktorvasas/Documents/Projects/Angular/store/public/index.html');
    });

    app.get('/authenticated', function (req, res, next) {

        if (req.session && req.session.loggedIn) {
            res.send(req.session);
        } else {
            res.send(null);
        }
    });

    app.use('/user', userRouter);
    app.use('/product', productRouter);
    app.use('/category', categoryRouter);

};
