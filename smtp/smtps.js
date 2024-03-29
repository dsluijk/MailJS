(function () {
'use strict';

var SMTPServer = require('smtp-server').SMTPServer;
var sys = require('../sys/main.js');
var config = require('../config.json');
var lookup = require('dnsbl-lookup');
var MailParser = require('mailparser').MailParser;
var tls = require('tls');

module.exports = function () {
    //SMTP submission receives emails send by other MTAs and handles them. No auth accepted, but only accepts local domains as RCPT TO.
    //Emails are stored in the database to be opened by there owner.
    var smtp = new SMTPServer({
        size: 1048576*15,
        SNICallback: function (domain, cb) {
            sys.domain.getCert(domain, function (err, cert) {
                if(err) {
                    return cb(err);
                }
                var context = tls.createSecureContext({
                    key: cert.key,
                    cert: cert.cert + '\n' + cert.caCert,
                    honorCipherOrder: true
                });
                return cb(null, context);
            });
        },
        ciphers: [
            "ECDHE-RSA-AES256-SHA384",
            "DHE-RSA-AES256-SHA384",
            "ECDHE-RSA-AES256-SHA256",
            "DHE-RSA-AES256-SHA256",
            "ECDHE-RSA-AES128-SHA256",
            "DHE-RSA-AES128-SHA256",
            "HIGH",
            "!aNULL",
            "!eNULL",
            "!EXPORT",
            "!DES",
            "!RC4",
            "!MD5",
            "!PSK",
            "!SRP",
            "!CAMELLIA"
        ].join(':'),
        honorCipherOrder: true,
        banner: 'MailJS ESMTPS service, welcome.',
        authMethods: [],
        disabledCommands: ['AUTH'],
        logger: false,
        onConnect: function(session, cb) {
            //A blocked IP for testing: 2.0.0.127
            var dnsbl = new lookup.dnsbl(session.remoteAddress, config.smtp.DNSBL);
            dnsbl.on('error',function(error,blocklist){
                sys.util.error('Could not check DNS blacklist on '+blocklist+' for '+session.remoteAddress+'.', error);
                cb(new Error('Internal Server Error.'));
            });
            dnsbl.on('data',function(result,blocklist){
                if(result.status == "listed") {
                    sys.util.log('Blocked '+session.remoteAddress+'\'s connection on SMTP submission because of a blacklist.');
                    return cb(new Error('IP blacklisted by '+blocklist+'.'));
                }
            });
            dnsbl.on('done', function(){
                return cb();
            });
        },
        onRcptTo: function(address, session, cb){
            sys.mailbox.verify(address.address, function (err, isValid) {
                if(err) {
                    return cb(err);
                }
                if(!isValid) {
                    return cb(new Error('Address not local.'));
                }
                return cb();
            });
        },
        onData: function(stream, session, cb){
            var parser = new MailParser({showAttachmentLinks: true});
            parser.on("end", function(mail){
                var error = false;
                if(stream.sizeExceeded){
                    err = new Error('Message exceeds maximum message size of 15 MB');
                    err.responseCode = 552;
                    return cb(err);
                }
                for (var i = 0; i < session.envelope.rcptTo.length; i++) {
                    if(error === false) {
                        sys.mailbox.verify(session.envelope.rcptTo[i].address, function (err, isValid, mailbox) {
                            if(err) {
                                error = true;
                                return cb(err);
                            }
                            if(!isValid) {
                                error = true;
                                return cb(new Error('Invalid mailbox `'+session.envelope.rcptTo[i].address+'`.'));
                            }
                            sys.email.create(
                                mailbox._id,
                                mail,
                                function(err, email) {
                                    if(err) {
                                        error = true;
                                        return cb(err);
                                    }
                                    if(i == session.envelope.rcptTo.length) {
                                        return cb(null, "Message stored.");
                                    }
                                }
                            );
                        });
                    }
                }
            });
            stream.pipe(parser);
        }
    });
    smtp.listen(config.smtp.submission, false, function () {
        sys.util.log('SMTP submission server started on port '+config.smtp.submission, true);
    });
};
}());
