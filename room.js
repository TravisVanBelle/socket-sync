var _ = require('lodash');

module.exports = class Room {
	constructor() {
		this.roomId = null
		this.players = [];
	}

	// Add a new player to the array of players
	newPlayer(player){
		this.players.push(player);
	}

	// Remove a player with the given uuid
	removePlayer(uuid){
		_.remove(this.players, function (e) {
			return e.uuid === uuid;
		});
	}

	// Return all players
	getAllPlayerData(){
		return this.players;
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
