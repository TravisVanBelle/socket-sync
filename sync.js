/**
 * A simple library for maintaining instance synchronization in a socket.io app.
 */
module.exports = class Sync {
	/**
	 * Sets up the Sync instance.
	 * io: The Socket.io object to attach listeners to.
	 */
	constructor(io){
		this.io = io;
		this.users = {};
		this.game = {
			userData: {}
		};
	}

  /**
	 * Adds a user/socket to the instance and sets up listeners.
	 * socket: The client socket object to add.
	 */
	addSocket(socket){
		this.users[socket.id] = socket;

		var self = this;

		// The client joins the room.
		socket.on('join', function (data){
			self._join(data, socket);
		});

		// The client leaves the room.
		socket.on('disconnect', function (){
			self._leave(socket);
		});

		// The client sends an uodate to the server.
		socket.on('sendUpdate', function(data){
			self._sendUpdate(data, socket);
		});

		// The client requests an update from the server.
		socket.on('requestUpdate', function(data){
			self._getUpdate(socket);
			socket.currentGameData = Object.assign({}, self.game);
		});

		// The client sends an instant update to the server.
		socket.on('sendInstant', function(data){
			self._getInstant(data, socket);
		});
	}

	/**
	 * Add a client to the instance.
	 * data: The client's initial data.
	 * socket: The client's socket object.
	 */
	_join(data, socket) {
		let roomId = 'default';

		socket.join(roomId);

		socket.currentGameData = {
			userData: {}
		};

		this.game.userData[socket.id] = data;
	}

	/**
	 * Remove a client from the instance.
	 * socket: The client's socket object to remove.
	 */
	_leave(socket) {
		delete this.game.userData[socket.id];
	}

	/**
	 * Update the game data that was sent from a cient.
	 * data: The game data to update.
	 * socket: The socket that sent the updated data.
	 */
	_sendUpdate(data, socket) {
		this.game.userData[socket.id] = data;
	}

	/**
	 * Send an update to a client.
	 * socket: The client socket to send data to.
	 */
	_getUpdate(socket) {
		socket.emit('getUpdate', this.game);
	}

	/**
	 * Send an instant update to all clients.
	 * data: The data to send to the clients.
	 * socket: The socket to broadcast to.
	 */
	_getInstant(data, socket) {
		socket.broadcast.to('default').emit('getInstant', data);
	}
}
