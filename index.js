var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Sync = require('./sync');

var sync = null;

io.on('connection', function(socket){

	// If no sync object, create it
	if (!sync) {
		sync = new Sync(io);
	}

	// When a user connects, register events
	sync.addSocket(socket);

});

http.listen(3000, function(){
	console.log('listening on *:3000');
});