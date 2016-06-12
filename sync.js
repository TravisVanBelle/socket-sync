module.exports = class Sync {
	constructor(io){
		this.io = io;

		this.users = {};

		this.datatypes = [];
		this.data = {};
	}

	addDatatype(type){
		this.data[type] = {};
		this.datatypes.push(type);
	}

	addSocket(socket){
		this.users[socket.id] = socket;

		// Event for when they join the room
		socket.on('join', this._join);
	}



	/**
	 * data: Object
	 *		roomid: String (The room to join.)
	 *		id: String (The socket id.)
	 *		userData: Object (All necessary data of a new user.)
	*/
	_join(data) {
		// Get socket
		var socket = this.users[data.id];
		var dataToSend;

		// Add player to the actual socket room
		socket.join(data.roomid);

		// Add user's data to data object for each datatype
		this.datatypes.forEach(function (type) {
			if (data.userData[type]) {
				this.data[type][data.id] = data.userData[type];
			}
		});

		// Send user all data about current session
		this.io.to(socket.id).emit('join--all-data', this.data);

		this.io.to(data.roomid).emit()

	}
}

// this.data: Object
// 	 'player': Array
//			- socketid
//			- player data