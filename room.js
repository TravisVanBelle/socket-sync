var _ = require('lodash');

module.exports = class Room {
	constructor() {
		this.roomId = null;
		this.users = [];
	}

	setRoomId(roomid) {
		this.roomId = roomid;
	}

	// Add a new user to the array of players
	newUser(user, socketId){
		this.users.push(user);
		this.users[this.users.length-1].socketId = socketId;
	}

	// Remove a user with the given socketId
	removeUser(socketId){
		_.remove(this.users, function (e) {
			return e.socketId === socketId;
		});
	}

	// Return all users
	getAllUserData(){
		return this.users;
	}




	setPlayerPosition(uuid, x, y){
		this.players.forEach((p) => {
			if (p.uuid === uuid){
				p.x = x;
				p.y = y;
			}
		});
	}
}
