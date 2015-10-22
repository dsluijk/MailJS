/**
 * @file The main HTTP handler
 * @author AtlasDev
 * @copyright Dany Sluijk 2015
 */

var http = function() {

var express = require('express');
var passport = require('passport');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var config = require('../config.json');
var v1apiRouter = require('./v1/apiRouter.js');
var socketio = require('./socketio.js');
var util = require('../util.js');
var mongoose = require('mongoose');
var session = require('express-session');
var sessions = require('./sessions.js');

var app = express();
var http = require('http').Server(app);

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');
app.set('views',__dirname + '/views');

app.use(cookieParser());

app.use(session({
    name: "MailJS",
    secret: 'test',
    resave: false,
    saveUninitialized: true,
    cookie: { path: '/', httpOnly: false, secure: false, maxAge: null },
    store: new sessions(),
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(passport.initialize());

app.use(function(err, req, res, next) {
    if(err.name == 'SyntaxError') {
        return res.status(400).json({'EINVALID': 'JSON invalid.'});
    }
    util.error('Express errored:', err);
    res.status(500).send('Internal Server Error');
});

socketio(http, app);

app.use('/api/v1', v1apiRouter);

http.listen(config.http.port);
util.log('Http server started at port '+config.http.port, true);

};

module.exports = http;
