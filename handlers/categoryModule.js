'use strict';

var CategoryHandler = function (db) {
    var modelAndSchemaName = 'category';
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Types.ObjectId;
    var schema = mongoose.Schemas[modelAndSchemaName];
    var CategoryModel = db.model(modelAndSchemaName, schema);

    this.addCategory = function (req, res, next) {
        var body = req.body;
        var categoryTitle = body.title;
        var productId = body.product || null;
        var error;
        var saveData;
        var model;

        if (!categoryTitle) {
            error = new Error();
            error.status = 400;
            error.message = "Enter category title, please!";

            return next(error);
        }

        saveData = {
            title: categoryTitle,
            products: productId
        };

        model = new CategoryModel(saveData);
        model.save(function (error, model) {
            if (error) {
                return next(error);
            }

            var finModel = {
                _id: model._id,
                title: model.title,
                products: model.products
            };

            res.status(201).send(finModel);
        })
    };

    this.getCategories = function (req, res, next) {

        CategoryModel
            .find({})
            .exec(function (error) {
                if (error) {
                    return next(error);
                }

                var pipeLine = [];

                pipeLine.push({
                    $unwind: {
                        path: '$products',
                        preserveNullAndEmptyArrays: true
                    }
                });

                pipeLine.push({
                    $lookup: {
                        from: 'products',
                        localField: 'products',
                        foreignField: '_id',
                        as: 'products'
                    }
                });

                pipeLine.push({
                    $project: {
                        title: 1,
                        products: {$arrayElemAt: ['$products', 0]}
                    }
                });

                pipeLine.push({
                    $project: {
                        title: 1,
                        products: {
                            _id: '$products._id',
                            title: '$products.title',
                            price: '$products.price'
                        }
                    }
                });

                pipeLine.push({
                    $group: {
                        _id: '$_id',
                        title: {$first: '$title'},
                        products: {$addToSet: '$products'}
                    }
                });

                CategoryModel.aggregate(pipeLine)
                    .exec(function (error, categoryModel) {
                        if (error) {
                            return next(error);
                        }
                        res.status(200).send(categoryModel);
                    })
            })
    };

    this.getCategoryById = function (req, res, next) {
        var id = req.params.id;
        var pipeLine = [];

        id = new ObjectId(id);

        pipeLine.push({
            $match: {
                _id: id
            }
        });

        pipeLine.push({
            $unwind: {
                path: '$products',
                preserveNullAndEmptyArrays: true
            }
        });

        pipeLine.push({
            $lookup: {
                from: 'products',
                localField: 'products',
                foreignField: '_id',
                as: 'products'
            }
        });

        pipeLine.push({
            $project: {
                title: 1,
                products: {$arrayElemAt: ['$products', 0]}
            }
        });

        pipeLine.push({
            $project: {
                title: 1,
                products: {
                    _id: '$products._id',
                    title: '$products.title',
                    price: '$products.price'
                }
            }
        });

        pipeLine.push({
            $group: {
                _id: '$_id',
                title: {$first: '$title'},
                products: {$addToSet: '$products'}
            }
        });

        CategoryModel.aggregate(pipeLine)
            .exec(function (error, categoryModel) {
                if (error) {
                    return next(error);
                }
                res.status(200).send(categoryModel[0]);
            })
    };

    this.removeProductsFromCategory = function (req, res, next) {
        var id = req.params.id;
        var body = req.body;
        var productId = body.product || null;

        productId = new ObjectId(productId);

        CategoryModel.findByIdAndUpdate(id, {
            $pull: {
                'products': productId
            }
        }, {
            new: true
        }, function (error) {
            if (error) {
                return next(error);
            }
            res.status(200).send('Product successful removed from category');
        })

    };

    this.addProductToCategory = function (req, res, next) {
        var id = req.params.id;
        var body = req.body;
        var productId = body.product || null;

        CategoryModel.findByIdAndUpdate(id, {
            $addToSet: {
                'products': productId
            }
        }, {
            new: true
        }, function (error) {
            if (error) {
                return next(error);
            }
            res.status(200).send('Product successful added');
        })
    };

    this.changeCategory = function (req, res, next) {
        var id = req.params.id;
        var body = req.body;
        var categoryTitle = body.title;

        CategoryModel.findByIdAndUpdate(id, {$set: {'title': categoryTitle}}, function (error, model) {
            if (error) {
                return next(error);
            }

            res.status(200).send(model);
        })
    };

    this.deleteCategory = function (req, res, next) {
        var id = req.params.id;

        CategoryModel.findByIdAndRemove(id, function (error, model) {
            if (error) {
                return next(error);
            }
            res.status(200).send(model);
        })
    }
};

module.exports = CategoryHandler;