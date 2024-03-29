(function () {
'use strict';

var mongoose = require('mongoose');
var sys = require('../sys/main.js');

var TransferSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true
    },
    type: {
        type: Number,
        required: true
    },
    object: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60*60*24
    },
    maxUses: {
        type: Number,
        default: 0,
    },
    uses: {
        type: Number,
        default: 0
    }
});

TransferSchema.methods.generate = function(type, cb) {
    var uid;
    switch (type) {
        case 1:
            //Contactlist
            uid = sys.util.uid(15);
            break;
        case 2:
            //Mailbox
            uid = sys.util.uid(18);
            break;
        case 3:
            //Domain
            uid = sys.util.uid(20);
            break;
    }
    this.code = uid;
    cb();
};

TransferSchema.methods.isValid = function(cb) {
    if(new Date(this.createdAt.getTime() + 86400000).getTime() <= new Date().getTime()) {
        this.remove(function (err) {
            if(err) {
                return cb(err, false);
            }
        });
        return cb(null, false);
    }
    if(this.maxUses !== 0 && this.maxUses <= this.uses) {
        this.remove(function (err) {
            if(err) {
                return cb(err, false);
            }
        });
        return cb(null, false);
    }
    return cb(null, true);
};

TransferSchema.methods.use = function(cb) {
    var self = this;
    this.isValid(function (err, isValid) {
        if(err) {
            return cb(err);
        }
        if(isValid === false) {
            return cb(new Error('Code is invalid'));
        }
        self.uses += 1;
        self.save(function (err) {
            if(err) {
                return cb(err);
            }
            return cb();
        });
    });
};

module.exports = mongoose.model('Transfer', TransferSchema);
}());
