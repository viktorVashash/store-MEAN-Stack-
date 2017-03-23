'use strict';

module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var schema = new mongoose.Schema({
        title: {type: String, unique: true},
        products: [{type: ObjectId, ref: 'product'}],
        createdBy: {
            user: {type: ObjectId, ref: 'user', default: null},
            date: {type: Date, default: new Date()}
        },
        editedBy: {
            user: {type: ObjectId, ref: 'user', default: null},
            date: {type: Date, default: new Date()}
        }
    }, {collections: 'categories'});

    mongoose.model('category', schema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.category = schema;
})();