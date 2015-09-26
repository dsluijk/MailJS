var util = require('../util.js');
var Mailbox = require('../models/mailbox.js');
var Domain = require('../models/domain.js');
var User = require('../models/user.js');
var inboxFunc = require('./inbox.js');

/**
 * Create a new mailbox
 * @name createMailbox
 * @since 0.1.0
 * @version 1
 * @param {string} local Local part of the mail address to be registered, in the form of `info` for `info@example.com`.
 * @param {string} domainID ID of the domain to register the mailbox to.
 * @param {string} userID ID of the user to register the mailbox to.
 * @param {string} transferable Set if the mailbox is transferable to other users.
 * @param {string} overwrite Overwrite the disabled check for the domain.
 * @param {createMailboxCallback} callback Callback function after creating the mailbox.
 */

/**
 * Callback for creating a new mailbox.
 * @callback createMailboxCallback
 * @param {Error} err Error object, should be undefined.
 * @param {Object} mailbox Mailbox object of the new created mailbox.
 */
exports.create = function (local, domainID, userID, transferable, overwrite, callback) {
    if (!userID.toString().match(/^[0-9a-fA-F]{24}$/)) {
        var error = new Error('Invalid user ID!');
        error.name = 'EINVALID';
        return callback(error);
    }
    if (!domainID.toString().match(/^[0-9a-fA-F]{24}$/)) {
        var error = new Error('Invalid domain ID!');
        error.name = 'EINVALID';
        return callback(error);
    }
    var overwrite = overwrite || false;
    //TODO: local part validation
    Domain.findById(domainID, function (err, domain) {
        if(err) {
            return callback(err);
        }
        if(!domain) {
            var error = new Error('Domain not found.');
            error.name = 'ENOTFOUND';
            return callback(error);
        }
        if(domain.disabled == true) {
            if(overwrite != true) {
                var error = new Error('Specified domain has been disabled for registrations.');
                error.name = 'EDENIED';
                return callback(error);
            }
        }
        var address = local+'@'+domain.domain;
        Mailbox.findOne({address: address}, function (err, resMailbox) {
            if(err) {
                return callback(err);
            }
            if(resMailbox) {
                var error = new Error('Address already registered.');
                error.name = 'EOCCUPIED';
                return callback(error);
            }
            var mailbox = new Mailbox();
            mailbox.address = address;
            mailbox.domain = domainID;
            mailbox.admins = [ userID ];
            mailbox.creator = userID;
            mailbox.transferable = transferable;
            mailbox.generateTransferCode(function () {
                mailbox.generateSMTPToken(function () {
                    mailbox.save(function (err, mailbox) {
                        if(err) {
                            return callback(err);
                        }
                        inboxFunc.createDefaults(mailbox._id, function (err) {
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
                                    util.log('Mailbox `'+mailbox.address+'` created.')
                                    return callback(null, mailbox);
                                }
                            );
                        })
                    });
                });
            });
        })
    })
}

/**
 * Find a mailbox by ID
 * @name findMailbox
 * @since 0.1.0
 * @version 1
 * @param {string} mailboxID ID of the mailbox to recieve.
 * @param {findMailboxCallback} callback Callback function after receiving the mailbox.
 */

/**
 * Callback for finding a mailbox.
 * @callback findMailboxCallback
 * @param {Error} err Error object, should be undefined.
 * @param {Object|Boolean} mailbox Mailbox object of the found mailbox, false if not found.
 */
exports.find = function (mailboxID, callback) {
    if (!mailboxID.toString().match(/^[0-9a-fA-F]{24}$/)) {
        var error = new Error('Invalid user ID!');
        error.name = 'EINVALID';
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
}
