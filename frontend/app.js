'use strict';

var frontend = function frontend(core) {
    var express = require('express');
    var app = core.express;
    var socketioJwt = require('socketio-jwt');
    var jwt = require('jsonwebtoken');
    var secret = require('fs').readFileSync('./keys/jwt.key');
    var io = require('socket.io')(core.http);

    app.use(express.static(__dirname + '/public'));
    app.all('/api/v1/login', function (req, res) {
        var token = jwt.sign({ username: req.body.username }, secret, {expiresInMinutes: 1440});
        res.json({"error": "", "jwt": token});
        //res.status(400).json({"error": "Username/password incorrect", "jwt": ""});
    });

    io.use(socketioJwt.authorize({
        secret: secret,
        handshake: true
    }));

    io.on('connection', function(socket) {
        //console.log(socket.decoded_token.username);

        socket.on('mail:star', function(data) {
            io.sockets.emit('mail:star', {uuid: data.uuid, state: data.state});
        });
        socket.on('mail:delete', function(data) {
            io.sockets.emit('mail:delete', {uuid: data.uuid});
        });
        socket.on('mail:read', function(data) {
            io.sockets.emit('mail:read', {uuid: data.uuid, state: data.state});
        });
        socket.on('mail:list', function(data) {
            if(data.mailbox == 'inbox') {
                var mails = [
                    {uuid: 'i-1', mailbox: 'inbox', sender: 'Jane Doe', subject: 'Some random subject', date: 1432737154000, read: true, starred: true, attachment: false},
                    {uuid: 'i-2', mailbox: 'inbox', sender: 'Jane Doe', subject: 'Some random subject', date: 1433168277937, read: true, starred: true, attachment: false},
                    {uuid: 'i-3', mailbox: 'inbox', sender: 'John Doe', subject: 'Blablabra', date: 1431168277937, read: true, starred: true, attachment: false},
                    {uuid: 'i-4', mailbox: 'inbox', sender: 'Dany Sluijk', subject: 'Mail test', date: 1430168277937, read: true, starred: true, attachment: false},
                    {uuid: 'i-5', mailbox: 'inbox', sender: 'Jane Doe', subject: 'Some random subject', date: 1433168277937, read: true, starred: true, attachment: false},
                    {uuid: 'i-6', mailbox: 'inbox', sender: 'Jane Doe', subject: 'Lsfdshbcjbdvsbffvsgjfvsdgjfvsnvdsnbdsvvhdsvvhdsvdshvnb', read: false, date: 1433168277937, starred: true, attachment: false},
                    {uuid: 'i-7', mailbox: 'inbox', sender: 'Jane Doe', subject: 'Some random subject', date: 1433168277937, read: false, starred: false, attachment: false},
                    {uuid: 'i-8', mailbox: 'inbox', sender: 'Jane Doe', subject: 'Some random subject', date: 1433168277937, read: false, starred: false, attachment: true},
                    {uuid: 'i-9', mailbox: 'inbox', sender: 'Jane Doe', subject: 'Some random subject', date: 1433168277937, read: true, starred: true, attachment: true},
                    {uuid: 'i-10', mailbox: 'inbox', sender: 'Jane Doe', subject: 'Some random subject', date: 1433168277937, read: false, starred: true, attachment: false},
                    {uuid: 'i-11', mailbox: 'inbox', sender: 'Jane Doe', subject: 'Some random subject', date: 1433168277937, read: false, starred: false, attachment: true},
                    {uuid: 'i-12', mailbox: 'inbox', sender: 'Jane Doe', subject: 'Some random subject', date: 1433168277937, read: true, starred: false, attachment: true},
                    {uuid: 'i-13', mailbox: 'inbox', sender: 'Jane Doe', subject: 'Some random subject', date: 1433168277937, read: false, starred: true, attachment: false},
                    {uuid: 'i-14', mailbox: 'inbox', sender: 'Jane Doe', subject: 'Some random subject', date: 1433168277937, read: true, starred: false, attachment: false},
                    {uuid: 'i-15', mailbox: 'inbox', sender: 'Jane Doe', subject: 'Some random subject', date: 1433168277937, read: false, starred: true, attachment: true},
                    {uuid: 'i-16', mailbox: 'inbox', sender: 'Jane Doe', subject: 'Some random subject', date: 1433168277937, read: true, starred: true, attachment: false},
                    {uuid: 'i-17', mailbox: 'inbox', sender: 'Jane Doe', subject: 'Some random subject', date: 1433168277937, read: false, starred: false, attachment: false},
                    {uuid: 'i-18', mailbox: 'inbox', sender: 'Jane Doe', subject: 'Some random subject', date: 1433168277937, read: false, starred: false, attachment: true},
                    {uuid: 'i-19', mailbox: 'inbox', sender: 'Jane Doe', subject: 'Some random subject', date: 1433168277937, read: true, starred: true, attachment: false},
                    {uuid: 'i-20', mailbox: 'inbox', sender: 'Jane Doe', subject: 'Some random subject', date: 1433168277937, read: false, starred: false, attachment: false},
                    {uuid: 'i-21', mailbox: 'inbox', sender: 'Jane Doe', subject: 'Some random subject', date: 1433168277937, read: true, starred: true, attachment: false},
                    {uuid: 'i-22', mailbox: 'inbox', sender: 'Jane Doe', subject: 'Some random subject', date: 1433168277937, read: false, starred: true, attachment: false},
                ];
                io.sockets.emit('mail:list', {err: null, mails: mails, mailbox: data.mailbox});
            } else if(data.mailbox == 'send') {
                var mails = [
                    {uuid: 's-1', mailbox: 'send', sender: 'Dany Sluijk', subject: 'dbghjdfgfhjdrdv', date: 1432737174000, read: true, starred: false, attachment: true},
                    {uuid: 's-2', mailbox: 'send', sender: 'Dany Sluijk', subject: 'dwegwegghsdfrghjdrdv', date: 1432737174000, read: false, starred: true, attachment: false},
                    {uuid: 's-3', mailbox: 'send', sender: 'Dany Sluijk', subject: 'dbghjdfgdaddrdv', date: 1432737174000, read: true, starred: true, attachment: false},
                    {uuid: 's-4', mailbox: 'send', sender: 'Dany Sluijk', subject: 'wrehergwgdv', date: 1432737174000, read: false, starred: false, attachment: true},
                    {uuid: 's-5', mailbox: 'send', sender: 'Dany Sluijk', subject: 'dbghjdgergejdrdv', date: 1432737174000, read: true, starred: true, attachment: false},
                ];
                io.sockets.emit('mail:list', {err: null, mails: mails, mailbox: data.mailbox});
            } else {
                io.sockets.emit('mail:list', {err: 'Could not find mailbox `'+data.mailbox+'`', mails: null, mailbox: data.mailbox})
                
            }
        });
        socket.on('mail:get', function(data) {
            if(data.uuid == '5') {
                var response = {
                    subject: "Test email is testing",
                    sender: 'danysluyk@live.nl',
                    date: 1433168277937,
                    content: 'short test mail',
                    attachment: {}
                }
                socket.emit('mail:get', {data: response, err: null});
            } else {
                socket.emit('mail:get', {data: null, err: 'Mail `'+data.uuid+'` not found'});
            }
        });
    });

};

module.exports = frontend;