var Room = require('./room');

module.exports = class Sync {
	constructor(io){
		this.io = io;

		this.users = {};

		this.datatypes = [];
		this.data = {};
		this.rooms = {};
	}

	addSocket(socket){
		this.users[socket.id] = socket;

		var self = this;

		// Event for when they join the room
		socket.on('join', function (data){
			self._join(data, socket);
		});

		// Remove a player from the room when they disconnect.
		socket.on('disconnect', function (data){
			self._leave(data, socket);
		});
	}



	/**
	 * data: Object
	 *		roomid: String (The room to join.)
	 *		uuid: String (The users uuid.)
	 *		userData: Object (All necessary data of a new user.)
	*/
	_join(data, socket) {
		console.log('joining');
		// Get user data
		let userData = data;
		let roomId = data.roomId;
		let socketId = socket.id;

		// If room doesn't exist, create room
		if (!this.rooms[roomId]){
			this.rooms[roomId] = new Room();
			this.rooms[roomId].setRoomId(roomId);
		}

		// Send msg of new user to current users
		this.io.to(roomId).emit('newUser', userData);

		// Send msg to new user of current users
		this.io.to(socketId).emit('allUsers', this.rooms[roomId].getAllUserData());

		// Add user to room
		this.rooms[roomId].newUser(userData, socket.id);

		socket.join(roomId);

		socket.gameData = {
			roomId: roomId,
			socketId: socket.id
		}
	}

	_leave(data, socket) {
		// Todo: Notify the room

		// Remove from the array
		this.rooms[socket.gameData.roomId].removeUser(socket.id);
	}
}

// this.data: Object
// 	 'player': Array
//			- socketid
//			- player data