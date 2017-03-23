'use strict';

var express = require('express');
var router = express.Router();
var CategoryHandler = require('../handlers/categoryModule');

module.exports = function (app) {
    var db = app.db;
    var categoryHandle = new CategoryHandler(db);

    router.post('/', categoryHandle.addCategory);
    router.get('/:id', categoryHandle.getCategoryById);
    router.get('/', categoryHandle.getCategories);
    router.patch('/add_to/:id', categoryHandle.addProductToCategory);
    router.patch('/:id', categoryHandle.changeCategory);
    router.delete('/remove/:id', categoryHandle.removeProductsFromCategory);
    router.delete('/:id', categoryHandle.deleteCategory);

    return router;
};
