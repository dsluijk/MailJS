var mongoose = require('mongoose');
var config = require('./config.json');
var colors = require('colors');
var pack = require('./package.json');
var sys = require('./sys/main.js');
var redis = require('redis');
var util = require('./util.js');

if(config.noinstall == true) {
    process.exit(0);
}

console.log('\n')
console.log(' __  __       _ _    '+'    _  _____  '.cyan);
console.log('|  \\\/  |     (_) | '+'     | |/ ____| '.cyan);
console.log('| \\\  / | __ _ _| | '+'     | | (___   '.cyan);
console.log('| |\\\/| |/ _` | | | '+' _   | |\\\___ \\\  '.cyan);
console.log('| |  | | (_| | | | '  +'|  __| |____) | '.cyan);
console.log('|_|  |_|\\\__,_|_|_| '+' \\\____/|_____/  '.cyan);
console.log('\n');
console.log('Installing MailJS');
console.log('System: ' + process.platform + ' @ ' + process.arch);
console.log('MailJS v' + pack.version);
console.log('NodeJS ' + process.version);
console.log('V8 engine v' + process.versions.v8);
console.log('');

if(!config.configured) {
    console.log('MailJS not configured!'.red);
    process.exit(1);
}

console.log('Connecting to the database..');
var dburl = 'mongodb://'+config.db.host+':'+config.db.port+'/'+config.db.database;
mongoose.connect(dburl);

mongoose.connection.on('open', function(){
    console.log('Connecting to redis');
    var client = redis.createClient(config.redis.port, config.redis.host);

    client.on('ready', function () {
        redisstuff(client);
    });
});

var redisstuff = function (client) {
    console.log('Creating session secret..');
    var key = util.uid(32);
    client.set("settings:setup", "true");
    console.log('Setting session secret..');
    client.set("settings:sessionKey", key);
    SavePerms(function (group) {
        dbstuff(group);
    });
}

var dbstuff = function (group) {
    console.log('Creating first user.');
    console.log(' - Generating password..');
    var password = util.uid(8);
    console.log('   - password generated');
    sys.user.create('admin', password, group._id, function (err, user) {
        if (err) {
            console.log(colors.red('Failed to create initial user: '.red+err));
            process.exit(1);
        }
        console.log(' - User created.');
        console.log('Creating first domain..');
        sys.domain.create(config.install.domain, false, function (err) {
            if (err) {
                console.log(colors.red('Failed to create initial domain: '.red+err));
                process.exit(1);
            }
            console.log('Domain created.');
            console.log('Creating initial mailbox..');
            sys.mailbox.create('info@'+config.install.domain, user._id, true, true, function (err, mailbox) {
                if (err) {
                    console.log(colors.red('Failed to create initial mailbox: '.red+err));
                    process.exit(1);
                }
                console.log('Initial mailbox created.');
                console.log('');
                console.log('########################################');
                console.log('##                                    ##');
                console.log('##  Installation Finished!            ##');
                console.log('##  Initial account details:          ##');
                console.log('##  Username: '+'admin'.cyan+'                   ##');
                console.log('##  Password: '+colors.cyan(password)+'                ##');
                console.log('##  Mailaddress: '+'info@'.cyan+config.install.domain.cyan+'     ##');
                console.log('##  SAVE THIS INFORMATION CAREFULLY!  ##');
                console.log('##  It is NOT recoverable!            ##');
                console.log('##                                    ##');
                console.log('########################################');
                process.exit(0);
            });
        });
    });
}

var SavePerms = function SavePerms(cb) {
    console.log('Creating default groups..');
    sys.perms.createGroup('Administrators', 'Administrators', [
        'user.list',
        'user.create',
        'user.delete',
        'user.protected',
        'user.overwrite',
        'user.group.change',
        'client.create',
        'client.list',
        'client.delete',
        'mailbox.create',
        'domain.create'
    ], function (err, adminGroup) {
        if(err) {
            if (err) {
                console.log(colors.red('Failed to create initial Administrators group: '.red+err));
                process.exit(1);
            }
        }
        console.log(' - Admin group created');
        sys.perms.createGroup('Moderators', 'Moderators', [
            'user.list',
            'user.create',
            'user.delete',
            'user.protected',
            'client.create',
            'client.list',
            'mailbox.create'
        ], function (err, modGroup) {
            if(err) {
                if (err) {
                    console.log(colors.red('Failed to create initial Moderators group: '.red+err));
                    process.exit(1);
                }
            }
            console.log(' - Moderators group created.');
            sys.perms.createGroup('Users', 'Users', [
                'user.list',
                'user.create',
                'user.delete',
                'user.protected',
                'client.create',
                'client.list',
                'mailbox.create'
            ], function (err, userGroup) {
                if(err) {
                    if (err) {
                        console.log(colors.red('Failed to create initial Users group: '.red+err));
                        process.exit(1);
                    }
                }
                console.log(' - Users group created.');
                console.log('Default groups created.');
                cb(adminGroup);
            });
        });
    });
}
