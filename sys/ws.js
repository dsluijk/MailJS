(function () {
'use strict';

/**
 * @file Centerialized websocket server.
 * @author AtlasDev
 * @copyright Dany Sluijk 2015
 */

// Redis events prefixes, followed by the mongoID:
//  - M: mailbox events
//  - U: user events
//  - S: system events

// Normal message format:
//     - {String} type: 'event'
//     - {String} eventName: Name of the event as defined.
//     - {Object} (optional) data: Data assosiated with the event.

// Error message:
//     - {String} type: 'error'
//     - {object} error: error object.
//         - name: name of the error.
//         - message: explanation of the error.

var redis = require('redis');
var Ws = require('ws').Server;
var util  = require('./util.js');
var config = require('../config.json');
var sys = require('./main.js');
var validator = require('validator');
var uuid = require('uuid');

var sub = redis.createClient(config.redis.port, config.redis.host);
var pub = require('./redis.js');
var exported = function () {};

var users = {};
var mailboxes = {};

exported();

sub.on("error", function (err) {
    util.error("Redis subscriber errored", err, true);
});

pub.on("error", function (err) {
    util.error("Redis publisher errored", err, true);
});

exported.start = function (server) {
    server = new Ws({ server: server, clientTracking: false });
    server.on('connection', function connection(ws) {
        ws.on('message', function incoming(msg, flags) {
            if (flags.binary) {
                ws.send(JSON.stringify({
                    type: 'error',
                    error: {
                        name: 'EINVALID',
                        message: 'Not accepting binary.'
                    }
                }), handleSend);
                ws.close();
                return;
            }
            try {
                msg = JSON.parse(msg);
            } catch (e) {
                ws.send(JSON.stringify({
                    type: 'error',
                    error: {
                        name: 'EINVALID',
                        message: 'Invalid JSON received.'
                    }
                }), handleSend);
                ws.close();
                return;
            }
            if(!msg.eventName) {
                ws.send(JSON.stringify({
                    type: 'error',
                    error: {
                        name: 'EINVALID',
                        message: 'No eventName received.'
                    }
                }), handleSend);
                ws.close();
                return;
            }
            if(msg.eventName == "auth") {
                if(!msg.data || !msg.data.token) {
                    ws.send(JSON.stringify({
                        type: 'error',
                        error: {
                            name: 'EINVALID',
                            message: 'Missing data.'
                        }
                    }), handleSend);
                    return;
                }
                msg.data.type = msg.data.type || 'session';
                if(msg.data.type == 'session') {
                    sys.sessions.getSession(msg.data.token, function (err, session) {
                        if(err) {
                            ws.send(JSON.stringify({
                                type: 'error',
                                error: {
                                    name: 'EAUTH',
                                    message: 'Authentication failed.'
                                }
                            }), handleSend);
                            ws.close();
                            return;
                        }
                        sys.user.find(session.id, function (err, user) {
                            if(err) {
                                ws.send(JSON.stringify({
                                    type: 'error',
                                    error: {
                                        name: 'EAUTH',
                                        message: 'Authentication failed.'
                                    }
                                }), handleSend);
                                ws.close();
                                return;
                            }
                            if(!user) {
                                ws.send(JSON.stringify({
                                    type: 'error',
                                    error: {
                                        name: 'EAUTH',
                                        message: 'Authentication failed.'
                                    }
                                }), handleSend);
                                ws.close();
                                return;
                            }
                            handleClient(ws, user);
                        });
                    });
                } else if(msg.data.type == 'oauth') {
                    ws.send(JSON.stringify({
                        type: 'error',
                        error: {
                            name: 'ENOTIMPLEMENTED',
                            message: 'oAuth authentication has not been implemented yet.'
                        }
                    }), handleSend);
                    ws.close();
                    return;
                } else {
                    ws.send(JSON.stringify({
                        type: 'error',
                        error: {
                            name: 'EAUTH',
                            message: 'Unknown auth type.'
                        }
                    }), handleSend);
                    ws.close();
                    return;
                }
            } else {
                ws.send(JSON.stringify({
                    type: 'error',
                    error: {
                        name: 'ENOAUTH',
                        message: 'Not accepting events before authentication.'
                    }
                }), handleSend);
                ws.close();
            }
        });
        ws.send(JSON.stringify({
            type: 'event',
            eventName: 'S:responsive'
        }), handleSend);
    });
};

var handleClient = function handleClient(ws, user) {
    addUser(user, ws, function (err) {
        if(err) {
            ws.send(JSON.stringify({
                type: 'error',
                error: {
                    name: err.name,
                    message: err.message
                }
            }), handleSend);
            ws.close();
            return;
        }
        user.password = undefined;
        ws.send(JSON.stringify({
            type: 'event',
            eventName: 'S:authSuccess',
            data: {
                user: user
            }
        }), handleSend);
        ws.on('close', function close() {
            removeSocket(ws.id);
        });
        return;
    });
};

var addToMailbox = function addToMailbox(user, mailboxID, cb) {
    var error;
    if (!validator.isMongoId(mailboxID.toString())) {
        error = new Error('Invalid mailbox ID!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return cb(error);
    }
    if(user.mailboxes.indexOf(mailboxID) == -1) {
        error = new Error('User not user of the mailbox!');
        error.name = 'EINVALID';
        error.type = 400;
        return cb(error);
    }
    if(mailboxes[mailboxID]) {
        if(mailboxes[mailboxID].indexOf(user._id) != -1) {
            mailboxes[mailboxID].push(user._id);
            return cb();
        }
    } else {
        mailboxes[mailboxID] = [user._id];
        sub.subscribe('M:'+mailboxID);
        return cb();
    }
};

var addUser = function addUser(user, ws, cb) {
    var id;
    if(!users[user._id]) {
        sub.subscribe('U:'+user._id);
        users[user._id] = {};
        users[user._id].ws = {};
        users[user._id].mailboxes = [];
    }
    id = uuid.v4();
    ws.id = id;
    users[user._id].ws[id] = ws;
    users[user._id].mailboxes = user.mailboxes;
    var resting = user.mailboxes.length;
    for (var i = 0; i < user.mailboxes.length; i++) {
        addToMailbox(user, user.mailboxes[i], function (err) {
            if(err) {
                return cb(err);
            }
            resting -= 1;
            if(resting === 0) {
                return cb();
            }
        });
    }
};

var removeSocket = function (wsID) {
    var uid;
    for (uid in users) {
        if(users[uid].ws[wsID]) {
            delete users[uid].ws[wsID];
            if(Object.keys(users[uid].ws).length === 0) {
                for (var i = 0; i < users[uid].mailboxes.length; i++) {
                    mailboxes[users[uid].mailboxes[i]].splice(mailboxes[users[uid].mailboxes[i]].indexOf[uid], 1);
                    delete mailboxes[users[uid].mailboxes[i]][uid];
                    if(mailboxes[users[uid].mailboxes[i]].length <= 0) {
                        sub.unsubscribe('M:'+mailboxes[users[uid].mailboxes[i]]);
                        delete mailboxes[users[uid].mailboxes[i]];
                    }
                }
                sub.unsubscribe('U:'+uid);
                delete users[uid];
            }
        }
    }
};

var handleSend = function handleSend(err) {
    if(err) {
        util.error('Websocket errored!', err);
        return;
    }
};

var sendUser = function (userID, message) {
    var user = users[userID];
    if(!user) {
        return;
    }
    var socket;
    for(socket in user.ws) {
        if(user.ws[socket].readyState == 1) {
            user.ws[socket].send(JSON.stringify(message));
        } else if(user.ws[socket].readyState == 3) {
            removeSocket(userID, socket);
        }
    }
};

sub.on("message", function (channel, message) {
    var id = channel.substring(2);
    if(channel.charAt(0) == "M") {
        if(!mailboxes[id]) {
            return;
        }
        for (var i = 0; i < mailboxes[id].length; i++) {
            sendUser(mailboxes[id][i], message);
            return;
        }
    } else if(channel.charAt(0) == "U") {
        try {
            message = JSON.parse(message);
        } catch (e) {
            util.error('JSON parse error!', e);
        }
        if(message.eventName == "U:mailboxAdded") {
            sub.subscribe('M:'+message.data.mailbox._id);
            mailboxes[message.data.mailbox._id] = [id];
            users[id].mailboxes.push(message.data.mailbox._id);
        }
        sendUser(id, JSON.stringify(message));
        return;
    } else {
        return;
    }
});

exported.send = function send(channel, message, cb) {
    pub.publish(channel, message);
};

module.exports = exported;
}());
