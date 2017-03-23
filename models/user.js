"use strict";

module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var schema = new mongoose.Schema({
        name: {type: String, require: true},
        lastName: {type: String, require: true},
        login: {type: String, require: true},
        email: {
            type: String, unique: true, validate: function (email) {
                var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                return re.test(email);
            }
        },
        password: {type: String, require: true},
        admin: {type: Boolean, default: false},
        basket: [{type: ObjectId, ref: 'product'}],
        phone: {type: String, unique: true, require: true},
        country: {type: String, require: true},
        city: {type: String, require: true},
        address: {type: String, require: true},
        createdBy: {
            user: {type: ObjectId, ref: 'user', default: null},
            date: {type: Date, default: new Date()}
        },
        editedBy: {
            user: {type: ObjectId, ref: 'user', default: null},
            date: {type: Date, default: new Date()}
        }
    }, {collections: 'users'});

    schema.index({name: 1}, {unique: true});

    mongoose.model('user', schema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.user = schema;
})();
