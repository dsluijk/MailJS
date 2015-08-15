var colors = require('colors');
var cluster = require('cluster');

exports.error = function error(msg, stack, quit) {
	var name = '';
	if(cluster.isWorker) {
		var name = '[#'+cluster.worker.id+'] ';
	} else {
		var name = '[MSTR] ';
	}
	console.error(name+'Error'.red + '    ' + msg);
	if(stack && typeof stack != 'undefined') {
		console.error(name+'Error'.red + '    ' + stack.stack);
	}
	if(quit == true) {
		console.error(name+'Error'.red + '    Error is severe, quitting...');
		process.exit(1);
        console.log('\n');
	}
	return true;
}

exports.log = function log(msg, startup) {
	var name = '';
	if(cluster.isWorker) {
		var name = '[#'+cluster.worker.id+'] ';
	} else {
		var name = '[MSTR] ';
	}
    if(startup == true) {
        console.log(name+'Start'.green + '    ' + msg);
    } else {
        console.log(name+'Log'.cyan + '      ' + msg);
    }
    return true;
}

exports.uid = function uid (len) {
    var buf = []
        , chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        , charlen = chars.length;

    for (var i = 0; i < len; ++i) {
        buf.push(chars[getRandomInt(0, charlen - 1)]);
    }

    return buf.join('');
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}