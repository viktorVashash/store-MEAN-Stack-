'use strict';

var UserHandler = function (db) {
    var modelAndSchemaName = 'user';
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Types.ObjectId;
    var schema = mongoose.Schemas[modelAndSchemaName];
    var UserModel = db.model(modelAndSchemaName, schema);

    var bcrypt = require('bcryptjs');

    this.addUser = function (req, res, next) {
        var session = req.session;
        var body = req.body;
        var userName = body.name;
        var userLastName = body.lastName;
        var userLogin = body.login;
        var userEmail = body.email;
        var userPass = body.password;
        var admin = body.admin;
        var phone = body.phone;
        var country = body.country;
        var city = body.city;
        var address = body.address;
        var salt = bcrypt.genSaltSync(10);
        var error;
        var saveData;
        var model;

        if (!userLogin || !userPass || !userEmail) {
            error = new Error();
            error.status = 400;
            error.message = "Enter login, password and eMail, please!";

            return next(error);
        }

        saveData = {
            email: userEmail,
            login: userLogin,
            name: userName,
            lastName: userLastName,
            password: userPass,
            admin: admin,
            phone: phone,
            country: country,
            city: city,
            address: address
        };

        saveData.password = bcrypt.hashSync(saveData.password, salt);

        model = new UserModel(saveData);

        model.save(function (error, model) {
            if (error) {
                return next(error);
            }

            session.loggedIn = true;
            session.uid = model._id;
            session.uName = model.email;
            session.cookie.expires = false;

            var User = {
                _id: model._id,
                login: model.login
            };

            res.status(201).send(User);
        });
    };

    this.login = function (req, res, next) {
        var session = req.session;
        var body = req.body;
        var userEmail = body.email;
        var userPassword = body.password;
        var query;
        var error;

        if (!userEmail || !userPassword) {
            error = new Error();
            error.status = 400;
            error.message = "Wrong data!";

            next(error);
        }

        query = UserModel
            .findOne({email: userEmail});

        query.exec(function (error, user) {
            if (error) {
                return next(error);
            }

            if (!user || !bcrypt.compareSync(userPassword, user.password)) {
                error = new Error();
                error.status = 401;

                return next(error);
            }

            session.loggedIn = true;
            session.uid = user._id;
            session.uName = user.email;
            session.uAdmin = user.admin;
            session.uBasket = user.basket;
            session.cookie.expires = false;

            var userObj = {
                id: user._id,
                email: user.email,
                admin: user.admin
            };

            res.status(200).send(userObj);

        });
    };

    this.getUsers = function (req, res, next) {
        UserModel
            .find({})
            .exec(function (error, userModel) {
                if (error) {
                    return next(error);
                }
                res.status(200).send(userModel);
            })
    };

    this.getUserById = function (req, res, next) {
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
                path: '$basket',
                preserveNullAndEmptyArrays: true
            }
        });

        pipeLine.push({
            $lookup: {
                from: 'products',
                localField: 'basket',
                foreignField: '_id',
                as: 'basket'
            }
        });

        pipeLine.push({
            $project: {
                name: 1,
                login: 1,
                admin: 1,
                basket: {$arrayElemAt: ['$basket', 0]}
            }
        });

        pipeLine.push({
            $project: {
                name: 1,
                login: 1,
                admin: 1,
                basket: {
                    _id: '$basket._id',
                    title: '$basket.title',
                    price: '$basket.price'
                }
            }
        });

        pipeLine.push({
            $group: {
                _id: '$_id',
                login: {$first: '$login'},
                name: {$first: '$name'},
                admin: {$first: '$admin'},
                basket: {$push: '$basket'},
                totalPrice: {$sum: {$multiply: '$basket.price'}}
            }
        });

        UserModel.aggregate(pipeLine)
            .exec(function (error, userModel) {
                if (error) {
                    return next(error);
                }
                res.status(200).send(userModel[0]);
            })
    };

    this.addProductToBasket = function (req, res, next) {
        var id = req.params.id;
        var body = req.body;
        var productId = body.product || null;
        var err;

        id = new ObjectId(id);

        UserModel
            .find({_id: id})
            .exec(function (error, model) {
                if (error) {
                    return next(error);
                }

                if (model[0]._doc.admin) {
                    err = new Error("Admin cant add product to basket");
                    err.status = 500;
                    return next(err);
                }

                UserModel
                    .findByIdAndUpdate(id, {
                        $push: {
                            'basket': productId
                        }
                    }, {
                        new: true
                    }, function (error) {
                        if (error) {
                            return next(error);
                        }
                        res.status(200).send('Product successful added to your basket!');
                    })
            });
    };

    this.changeUser = function (req, res, next) {
        var id = req.params.id;
        var body = req.body;
        var userEmail = body.email;
        var userLogin = body.login;
        var userName = body.name;

        UserModel.findByIdAndUpdate(id, {
            $set: {
                'email': userEmail,
                'login': userLogin,
                'name': userName
            }
        }, {new: true}, function (error, model) {
            if (error) {
                return next(error);
            }
            res.status(200).send(model);
        })
    };

    this.removeProductFromBasket = function (req, res, next) {
        var id = req.params.id;
        var body = req.body;
        var productId = body.product || null;
        var err;

        id = new ObjectId(id);

        UserModel
            .find({_id: id})
            .exec(function (error, model) {
                if (error) {
                    return next(error);
                }

                if (model[0]._doc.admin) {
                    err = new Error("Admin cant remove product from basket");
                    err.status = 500;
                    return next(err);
                }

                UserModel
                    .findByIdAndUpdate(id, {
                        $pull: {
                            'basket': productId
                        }
                    }, {
                        new: true
                    }, function (error) {
                        if (error) {
                            return next(error);
                        }
                        res.status(200).send('Product successful removed from basket');
                    })
            });
    };

    this.logout = function (req, res, next) {
        var session = req.session;

        session.loggedIn = false;
        res.send(req.body);

    };

    this.deleteUser = function (req, res, next) {
        var id = req.params.id;

        UserModel.findByIdAndRemove(id, function (error, model) {
            if (error) {
                return next(error);
            }
            res.status(200).send(model);
        })
    };
};

module.exports = UserHandler;
