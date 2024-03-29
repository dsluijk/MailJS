(function () {
'use strict';

var Mailbox = require('../models/mailbox.js');
var Domain = require('../models/domain.js');
var User = require('../models/user.js');
var Inbox = require('../models/inbox.js');
var validator = require('validator');
var mongoose = require('mongoose');
var sys = require('./main.js');

/**
 * Create a new mailbox
 * @name createMailbox
 * @since 0.1.0
 * @version 2
 * @param {string} local Local part of the mail address to be registered, in the form of `info` for `info@example.com`.
 * @param {string} domainID ID of the domain to register the mailbox to.
 * @param {string} userID ID of the user to register the mailbox to.
 * @param {string} title Title of the mailbox, used as name when sending emails.
 * @param {string} overwrite Overwrite the disabled check for the domain.
 * @param {createMailboxCallback} callback Callback function after creating the mailbox.
 */

/**
 * @callback createMailboxCallback
 * @param {Error} err Error object, should be undefined.
 * @param {Object} mailbox Mailbox object of the new created mailbox.
 */
exports.create = function (local, domainID, userID, title, overwrite, callback) {
    var error;
    if (!validator.isMongoId(userID.toString())) {
        error = new Error('Invalid user ID!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return callback(error);
    }
    if (!validator.isMongoId(domainID.toString())) {
        error = new Error('Invalid domain ID!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return callback(error);
    }
    var localRegex = new RegExp(/^[a-z0-9,!#\$%&'\*\+/=\?\^_`\{\|}~-]+(\.[a-z0-9,!#\$%&'\*\+/=\?\^_`\{\|}~-]+)*/i);
    if(!localRegex.test(local) || local.length >= 65) {
        error = new Error('Invalid local part!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return callback(error);
    }
    overwrite = overwrite || false;
    //TODO: local part validation
    Domain.findById(domainID, function (err, domain) {
        var error;
        if(err) {
            return callback(err);
        }
        if(!domain) {
            error = new Error('Domain not found.');
            error.name = 'ENOTFOUND';
            error.type = 400;
            return callback(error);
        }
        if(domain.disabled === true) {
            if(overwrite !== true) {
                error = new Error('Specified domain has been disabled for registrations.');
                error.name = 'EDISABLED';
                error.type = 400;
                return callback(error);
            }
        }
        if(domain.creator != userID && domain.users.indexOf(userID) == -1) {
            error = new Error('Permission denied.');
            error.name = 'EPERMS';
            error.type = 401;
            return callback(error);
        }
        var address = local+'@'+domain.domain;
        Mailbox.findOne({address: address}, function (err, resMailbox) {
            if(err) {
                return callback(err);
            }
            if(resMailbox) {
                var error = new Error('Address already registered.');
                error.name = 'EOCCUPIED';
                error.type = 400;
                return callback(error);
            }
            var mailbox = new Mailbox();
            mailbox.address = address;
            mailbox.domain = domainID;
            mailbox.admins = [ userID ];
            mailbox.title = title;
            mailbox.creator = userID;
            mailbox.save(function (err, mailbox) {
                if(err) {
                    return callback(err);
                }
                sys.inbox.createDefaults(mailbox._id, function (err, inboxes) {
                    if(err) {
                        return callback(err);
                    }
                    User.findByIdAndUpdate(
                        userID,
                        {$push: {"mailboxes": mailbox._id}},
                        {safe: true, upsert: true},
                        function(err) {
                            if(err) {
                                return callback(err);
                            }
                            mailbox = mailbox.toObject();
                            mailbox.inboxes = inboxes;
                            var message = JSON.stringify({
                                type: 'event',
                                eventName: 'U:mailboxAdded',
                                data: {
                                    mailbox: mailbox,
                                    type: 'create'
                                }
                            });
                            sys.ws.send('U:'+userID, message);
                            sys.util.log('Mailbox `'+mailbox.address+'` created.');
                            return callback(null, mailbox);
                        }
                    );
                });
            });
        });
    });
};

/**
 * Find a mailbox by ID
 * @name findMailbox
 * @since 0.1.0
 * @version 1
 * @param {string} mailboxID ID of the mailbox to recieve.
 * @param {findMailboxCallback} callback Callback function after receiving the mailbox.
 */

/**
 * @callback findMailboxCallback
 * @param {Error} err Error object, should be undefined.
 * @param {Object|Boolean} mailbox Mailbox object of the found mailbox, false if not found.
 */
exports.find = function (mailboxID, callback) {
    if (!validator.isMongoId(mailboxID.toString())) {
        var error = new Error('Invalid mailbox ID!');
        error.name = 'EINVALID';
        error.type = 400;
        return callback(error);
    }
    Mailbox.findById(mailboxID, function (err, mailbox) {
        if(err) {
            return callback(err);
        }
        if(!mailbox) {
            return callback(null, false);
        }
        return callback(null, mailbox);
    });
};

/**
 * Verify a mail address
 * @name verifyMailbox
 * @since 0.1.0
 * @version 1
 * @param {string} mailAddress address of the mailbox to be verified.
 * @param {verifyMailboxCallback} callback Callback function after receiving the mailbox.
 */

/**
 * @callback verifyMailboxCallback
 * @param {Error} err Error object, should be undefined.
 * @param {Boolean} doesExists Boolean which gives if the address is valid.
 * @param {Object} mailbox The found mailbox. null if mailbox was invalid
 */
exports.verify = function (mailAddress, callback) {
    if (!validator.isEmail(mailAddress.toString())) {
        var error = new Error('Invalid mail address!');
        error.name = 'EINVALID';
        error.type = 400;
        return callback(error);
    }
    Mailbox.findOne({address: mailAddress}, function (err, mailbox) {
        if(err) {
            return callback(err);
        }
        if(!mailbox) {
            return callback(null, false);
        }
        return callback(null, true, mailbox);
    });
};

/**
 * Checks if a user is admin or creator of the given mailbox.
 * @name isAdmin
 * @since 0.1.0
 * @version 1
 * @param {string} mailboxID Mailbox to be checked against.
 * @param {string} userID User to check permissions for.
 * @param {isAdminCallback} callback Callback function after changing the boolean
 */

/**
 * @callback isAdminCallback
 * @param {Error} err Error object, should be undefined.
 * @param {Boolean} isAdmin Boolean which gives back if the user is an admin or creator.
 * @param {Object} mailbox The checked mailbox, null when error is not null.
 */
exports.isAdmin = function (mailboxID, userID, cb) {
    var error;
    if (!validator.isMongoId(mailboxID.toString())) {
        error = new Error('Invalid mailbox ID!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return callback(error);
    }
    if (!validator.isMongoId(userID.toString())) {
        error = new Error('Invalid user ID!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return callback(error);
    }
    exports.find(mailboxID, function (err, mailbox) {
        var error;
        if(err) {
            return cb(err);
        }
        if(mailbox === false) {
            error = new Error('Mailbox not found!');
            error.name = 'ENOTFOUND';
            error.type = 400;
            return cb(error);
        }
        if(mailbox.creator == userID || mailbox.admins.indexOf(userID) > -1) {
            return cb(null, true, mailbox);
        } else {
            return cb(null, false, mailbox);
        }
    });
};

/**
 * Get the main inbox of a mailbox.
 * @name getInbox
 * @since 0.1.0
 * @version 1
 * @param {string} mailboxID Mailbox id of the mailbox to get the inbox from
 * @param {getInboxCallback} callback Callback function after getting the inboxes.
 */

/**
 * @callback getInboxCallback
 * @param {Error} err Error object, should be undefined.
 * @param {Object} inbox The main inbox object.
 */
exports.getInbox = function (mailboxID, cb) {
    var error;
    if (!validator.isMongoId(mailboxID.toString())) {
        error = new Error('Invalid mailbox ID!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return callback(error);
    }
    mailboxID = mongoose.Types.ObjectId(mailboxID);
    Inbox.findOne({type: 'Inbox', mailbox: mailboxID}, function (err, inbox) {
        if(err) {
            return cb(err);
        }
        return cb(null, inbox);
    });
};

/**
 * Add a user to a mailbox
 * @name addUser
 * @since 0.1.0
 * @version 1
 * @param {MongoID} mailboxID ID of the mailbox to add the user to.
 * @param {Object} user MongoDB object of the user to add the mailbox to.
 * @param {addUserCallback} cb Callback function after adding an user.
 */

/**
 * @callback addUserCallback
 * @param {Error} err Error object, should be undefined.
 */
exports.addUser = function (mailboxID, user, cb) {
    var error;
    if(!validator.isMongoId(mailboxID.toString())) {
        error = new Error('Invalid mailbox ID!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return cb(error);
    }
    if(typeof user !== "object") {
        error = new Error('User not an object.');
        error.name = 'EINVALID';
        error.type = 500;
        return cb(error);
    }
    if(user.mailboxes.indexOf(mailboxID) > -1) {
        error = new Error('User already member of this mailbox.');
        error.name = 'EOCCUPIED';
        error.type = 400;
        return cb(error);
    }
    user.mailboxes.push(mailboxID);
    user.save(function (err) {
        if(err) {
            return cb(err);
        }
        var message = JSON.stringify({
            type: 'event',
            eventName: 'M:userAdded',
            data: {
                user: user._id,
                mailbox: mailboxID
            }
        });
        sys.ws.send('M:'+mailboxID, message);
        sys.util.log('User `'+user._id+'` has been added to the mailbox `'+mailboxID+'`');
        return cb(null);
    });
};
}());
