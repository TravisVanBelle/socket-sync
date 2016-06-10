var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Player = require('./player');
var Room = require('./room');

// Array of rooms
let rooms = {};

io.on('connection', function(socket){
	
	socket.on('join', function(msg){
		console.log(msg.uuid + ' has joined ' + msg.roomId);

		// Create player
		let player = new Player();

		player.x = msg.x;
		player.y = msg.y;
		player.uuid = msg.uuid;
		player.roomId = msg.roomId;
		player.socketId = socket.id;

		// If room doesn't exist, create room
		if (!rooms[player.roomId]){
			rooms[player.roomId] = new Room();
			rooms[player.roomId].roomId = player.roomId;
		}

		// Send msg of new player to current players
		io.to(player.roomId).emit('newUser', player);

		// Send msg to new player of current players
		io.to(player.socketId).emit('allUsers', rooms[player.roomId].getAllPlayerData());

		// Add player to room
		rooms[player.roomId].newPlayer(player);
		socket.join(msg.roomId);

		// Store game data in socket object
		socket.gameData = {
			roomId: msg.roomId,
			uuid: msg.uuid,
		};
	});

	// Remove a player from the room when they disconnect.
	socket.on('disconnect', function(msg){
		// Todo: Notify the room

		// Remove from the array
		rooms[socket.gameData.roomId].removePlayer(socket.gameData.uuid);
	});

	socket.on('tickUpdate', function(msg){
		rooms[socket.gameData.roomId].setPlayerPosition(socket.gameData.uuid, msg.x, msg.y);

		io.to(socket.id).emit('gameUpdate', rooms[socket.gameData.roomId].getAllPlayerData());
	});


});

http.listen(3000, function(){
	console.log('listening on *:3000');
});