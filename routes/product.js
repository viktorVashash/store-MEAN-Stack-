'use strict';

var express = require('express');
var router = express.Router();
var ProductHandler = require('../handlers/productModule');

module.exports = function (app) {
    var db = app.db;
    var productHandler = new ProductHandler(db);

    router.post('/', productHandler.addProduct);
    router.get('/:id', productHandler.getProductById);
    router.get('/', productHandler.getProducts);
    router.patch('/:id', productHandler.changeProduct);
    router.delete('/:id', productHandler.deleteProduct);

    return router;
};

