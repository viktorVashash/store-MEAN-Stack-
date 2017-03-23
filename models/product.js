"use strict";

module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var schema = new mongoose.Schema({
        picture: {type: String},
        title: {type: String},
        price: {type: Number},
        createdBy: {
            user: {type: ObjectId, ref: 'user', default: null},
            date: {type: Date, default: new Date()}
        },
        editedBy: {
            user: {type: ObjectId, ref: 'user', default: null},
            date: {type: Date, default: new Date()}
        }
    }, {collections: 'products'});

    mongoose.model('product', schema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.product = schema;
})();
