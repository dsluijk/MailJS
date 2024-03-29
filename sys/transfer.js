(function () {
'use strict';

var Transfer = require('../models/transfer.js');
var validator = require('validator');
var mongoose = require('mongoose');

/**
 * Create a new transfer code.
 * @name createTransfer
 * @since 0.1.0
 * @version 1
 * @param {string} object MongoID of the object to create the transfer code for.
 * @param {Int} type Type of the transfer code (1, 2 or 3).
 * @param {createTransferCallback} callback Callback function after creating the transfer code.
 */

/**
 * @callback createTransferCallback
 * @param {Error} err Error object, should be undefined.
 * @param {Object} code Transfer code object.
 */
exports.create = function (object, type, maxUses, cb) {
    var error;
    if (!validator.isMongoId(object.toString())) {
        error = new Error('Invalid object ID!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return callback(error);
    }
    if ((!validator.isInt(type.toString())) || type < 1 || type > 3) {
        error = new Error('Invalid type!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return callback(error);
    }
    if ((!validator.isInt(maxUses.toString())) || maxUses < 0) {
        error = new Error('Invalid maxUses!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return callback(error);
    }
    var code = new Transfer();
    code.generate(type, function () {
        code.object = mongoose.Types.ObjectId(object);
        code.type = type;
        code.maxUses = maxUses;
        code.save(function (err) {
            if(err) {
                return cb(err);
            }
            return cb(null, code);
        });
    });
};

/**
 * Find an existing transfer code.
 * @name findTransfer
 * @since 0.1.0
 * @version 1
 * @param {string} id MongoID of the object to find.
 * @param {findTransferCallback} cb Callback for finding a transfer code.
 */

/**
 * @callback findTransferCallback
 * @param {Error} err Error object, should be undefined.
 * @param {Object} code Transfer code.
 */
exports.find = function (id, cb) {
    var error;
    if (!validator.isMongoId(id.toString())) {
        error = new Error('Invalid transfer ID!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return callback(error);
    }
    Transfer.findById(id, function (err, code) {
        if(err) {
            return cb(err);
        }
        if(!code) {
            error = new Error('Code not found.');
            error.name = 'ENOTFOUND';
            error.type = 400;
            return cb(error);
        }
        code.isValid(function (err, isValid) {
            if(err) {
                return cb(err);
            }
            if(isValid !== true) {
                error = new Error('Code not valid anymore.');
                error.name = 'EEXPIRED';
                error.type = 410;
                return cb(error);
            }
            return cb(null, code);
        });
    });
};

/**
 * Find an existing transfer code by the code.
 * @name findTransferByCode
 * @since 0.1.0
 * @version 1
 * @param {string} code The code to find.
 * @param {findTransferByCodeCallback} cb Callback for finding a transfer code.
 */

/**
 * @callback findTransferByCodeCallback
 * @param {Error} err Error object, should be undefined.
 * @param {Object} code Transfer code.
 */
exports.findByCode = function (code, cb) {
    var error;
    Transfer.findOne({code: code}, function (err, code) {
        if(err) {
            return cb(err);
        }
        if(!code) {
            error = new Error('Code not found.');
            error.name = 'ENOTFOUND';
            error.type = 400;
            return cb(error);
        }
        code.isValid(function (err, isValid) {
            if(err) {
                return cb(err);
            }
            if(isValid !== true) {
                error = new Error('Code not valid anymore.');
                error.name = 'EEXPIRED';
                error.type = 410;
                return cb(error);
            }
            return cb(null, code);
        });
    });
};

/**
 * Find all transfer tokens tied to an specified object
 * @name findTransferByObject
 * @since 0.1.0
 * @version 1
 * @param {MongoID} objectID The object to find by.
 * @param {findTransferByObjectCallback} cb Callback for finding all transfer codes.
 */

/**
 * @callback findTransferByObjectCallback
 * @param {Error} err Error object, should be undefined.
 * @param {Array} codes list of all found transfer codes.
 */
exports.findByObject = function (objectID, type, cb) {
    var error;
    if (!validator.isMongoId(objectID.toString())) {
        error = new Error('Invalid object ID!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return callback(error);
    }
    if(!(type == 1 || type == 2 || type == 3)) {
        error = new Error('Invalid type!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return callback(error);
    }
    Transfer.find({object: objectID, type: type} , function (err, codes) {
        if(err) {
            return cb(err);
        }
        return cb(null, codes);
    });
};
})();
