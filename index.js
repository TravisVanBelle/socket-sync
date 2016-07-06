var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Player = require('./player');
var Room = require('./room');
var Sync = require('./sync');

var sync = null;

io.on('connection', function(socket){

	// If no sync object, create it and register datatypes
	if (!sync) {
		sync = new Sync(io);



	}

	// When a user connects, register events
	sync.addSocket(socket);
	
	





	/*

	// Remove a player from the room when they disconnect.
	socket.on('disconnect', function(msg){
		// Todo: Notify the room

		// Remove from the array
		rooms[socket.gameData.roomId].removePlayer(socket.gameData.uuid);
	});

	socket.on('tickUpdate', function(msg){
		rooms[socket.gameData.roomId].setPlayerPosition(socket.gameData.uuid, msg.x, msg.y);

		io.to(socket.id).emit('gameUpdate', rooms[socket.gameData.roomId].getAllPlayerData());
	});*/


});

http.listen(3000, function(){
	console.log('listening on *:3000');
});