'use strict';

var express = require('express');
var router = express.Router();
var UserHandler = require('../handlers/userModule');

module.exports = function (app) {
    var db = app.db;
    var userHandler = new UserHandler(db);

    router.post('/login', userHandler.login);
    router.post('/logout', userHandler.logout);
    router.post('/', userHandler.addUser);
    router.get('/:id', userHandler.getUserById);
    router.get('/', userHandler.getUsers);
    router.patch('/to_basket/:id', userHandler.addProductToBasket);
    router.patch('/:id', userHandler.changeUser);
    router.delete('/remove/:id', userHandler.removeProductFromBasket);
    router.delete('/:id', userHandler.deleteUser);

    return router;
};
