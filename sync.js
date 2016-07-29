var _ = require('lodash');

module.exports = class Sync {
	constructor(io){
		this.io = io;

		this.counter = 0;

		this.users = {};
		this.game = {
			userData: {}
		};
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

		// User sends an update to the server
		socket.on('serverUpdate', function(data){
			self._serverUpdate(data, socket);
		});

		// User requests an update from the server
		socket.on('requestUpdate', function(data){
			self._clientUpdate(data, socket);
			socket.currentGameData = Object.assign({}, self.game);
		});

		socket.on('sendInstant', function(data){
			self._sendInstant(data, socket);
		});
	}

	_serverUpdate(data, socket) {
		this.game.userData[socket.id] = data;
	}

	_clientUpdate(data, socket) {
		socket.emit('clientUpdate', this.game);
	}

	_sendInstant(data, socket) {
		socket.broadcast.to('default').emit('sendInstant', data);
	}

	_join(data, socket) {
		let roomId = 'default';

		socket.join(roomId);

		socket.currentGameData = {
			userData: {}
		};

		this.game.userData[socket.id] = data;
	}

	_leave(data, socket) {
		// Remove from the array of data
		delete this.game.userData[socket.id];
	}
}
