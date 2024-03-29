(function () {
'use strict';

var sys = require('../../../sys/main.js');
exports.getMailboxes = function (req, res) {
    var mailboxes = req.user.mailboxes;
    var foundMailboxes = [];
    for(var i = 0; i<mailboxes.length; i++) {
        sys.mailbox.find(mailboxes[i], function (err, mailbox) {
            if (err) return res.status(err.type || 500).json({error: {name: err.name, message: err.message}});
            if(mailbox === false) {
                return res.status(500).json({error: {name: 'ENOTFOUND', message: 'Mailbox `'+mailboxes[i]+'` not found, while it should be.'}});
            }
            mailbox = sys.util.copyObject(mailbox);
            sys.inbox.getInboxes(mailbox._id, function (err, inboxes) {
                if (err) return res.status(err.type || 500).json({error: {name: err.name, message: err.message}});
                mailbox.inboxes = inboxes;
                foundMailboxes.push(mailbox);
                if(mailboxes.length == foundMailboxes.length) {
                    return res.json({mailboxes: foundMailboxes});
                }
            });
        });
    }
};

exports.postMailbox = function (req, res) {
    if(!req.body.local || !req.body.domain || !req.body.title) {
        return res.status(400).json({error: {name: 'EINVALID', message: 'Request data is missing.'}});
    }
    sys.mailbox.create(req.body.local, req.body.domain, req.user._id, req.body.title, false, function (err, mailbox) {
        if (err) return res.status(err.type || 500).json({error: {name: err.name, message: err.message}});
        return res.json({mailbox: mailbox});
    });
};

exports.getMailbox = function (req, res) {
    if(req.user.mailboxes.indexOf(req.params.mailbox) == -1) {
        if(user.isAdmin) {
            runGetMailbox(req, res);
        } else {
            return res.status(404).json({error: {name: 'ENOTFOUND', message: 'Could not find mailbox.'}});
        }
    } else {
        runGetMailbox(req, res);
    }
};

function runGetMailbox(req, res) {
    sys.mailbox.find(req.params.mailbox, function (err, mailbox) {
        if (err) return res.status(err.type || 500).json({error: {name: err.name, message: err.message}});
        if(mailbox === false) {
            return res.status(404).json({error: {name: 'ENOTFOUND', message: 'Could not find mailbox.'}});
        }
        mailbox = sys.util.copyObject(mailbox);
        sys.user.findByMailbox(mailbox._id, function (err, users) {
            if (err) return res.status(err.type || 500).json({error: {name: err.name, message: err.message}});
            if(users === false) {
                return res.status(500).json({error: {name: 'ENOTFOUND', message: 'No users found in the database!'}});
            }
            mailbox.users = [];
            for(var i = 0; i<users.length; i++) {
                var cleanUser = users[i];
                cleanUser.username = undefined;
                cleanUser.password = undefined;
                cleanUser.tfaToken = undefined;
                cleanUser.mailboxes = undefined;
                cleanUser.tfa = undefined;
                cleanUser.isAdmin = undefined;
                mailbox.users[i] = cleanUser;
                if(users.length == mailbox.users.length) {
                    sys.inbox.getInboxes(req.params.mailbox, function (err, inboxes) {
                        if (err) return res.status(err.type || 500).json({error: {name: err.name, message: err.message}});
                        mailbox.inboxes = inboxes;
                        return res.json({mailbox: mailbox});
                    });
                }
            }
        });
    });
}
}());
