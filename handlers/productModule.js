'use strict';

var ProductHandler = function (db) {
    var modelAndSchemaName = 'product';
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Types.ObjectId;
    var schema = mongoose.Schemas[modelAndSchemaName];
    var ProductModel = db.model(modelAndSchemaName, schema);

    this.addProduct = function (req, res, next) {
        var body = req.body;
        var productTitle = body.title;
        var productPrice = body.price;
        var img = body.picture;
        var error;
        var saveData;
        var model;

        if (!productTitle || !productPrice) {
            error = new Error();
            error.status = 400;
            error.message = "Enter product title and product price, please!";

            return next(error);
        }

        saveData = {
            picture: img,
            title: productTitle,
            price: productPrice
        };

        model = new ProductModel(saveData);
        model.save(function (error, productModel) {
            if (error) {
                return next(error);
            }
            var model = {
                _id: productModel._id,
                title: productModel.title,
                price: productModel.price,
                picture: productModel.picture
            };

            res.status(200).send(model);
        })
    };

    this.getProducts = function (req, res, next) {
        var query = req.query;
        var page = query.page ? parseInt(query.page) : 1;
        var count = query.count ? parseInt(query.count) : 50;
        var skip = (page - 1) * count;
        ProductModel
            .find({}, {__v: 0})
            .setOptions({skip: skip, limit: count})
            .exec(function (error, productModel) {
                if (error) {
                    return next(error);
                }

                res.status(200).send(productModel);
            })
    };

    this.getProductById = function (req, res, next) {
        var id = req.params.id;
        var pipeLine = [];

        id = new ObjectId(id);

        pipeLine.push({
            $match: {
                _id: id
            }
        });

        pipeLine.push({
            $project: {
                picture: 1,
                title: 1,
                price: 1
            }
        });

        ProductModel.aggregate(pipeLine)
            .exec(function (error, productModel) {
                if (error) {
                    return next(error);
                }
                res.status(200).send(productModel[0]);
            })
    };

    this.changeProduct = function (req, res, next) {
        var id = req.params.id;
        var body = req.body;
        var productTitle = body.title;
        var productPrice = body.price;
        var productPicture = body.picture;

        ProductModel.findByIdAndUpdate(id, {
            $set: {
                'title': productTitle,
                'price': productPrice,
                'picture': productPicture
            }
        }, function (error, model) {
            if (error) {
                return next(error);
            }
            res.status(200).send(model);
        })
    };

    this.deleteProduct = function (req, res, next) {
        var id = req.params.id;

        ProductModel.findByIdAndRemove(id, function (error, model) {
            if (error) {
                return next(error);
            }

            res.status(200).send(model);
        })
    }
};

module.exports = ProductHandler;
