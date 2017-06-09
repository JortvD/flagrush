module.exports = function(io) {
	var namegenerator = require('./namegenerator')();
	var player = require('./player');
	var players = [];

	io.on('connection', function(socket) {
		/***** Handle packets *****/

		// A player is joining the server
		socket.on('join', function(name) {
			// If the name was null, generate a random name
			if(name == null) {
				name = generate();
			}

			var used = false;
			var s = false;
			for(var n in players) {
				if(players[n].name == name) {
					used = true;
				}

				if(players[n].socket.id == socket.id) {
					s = true;
				}
			}

			if(!used && !s) {
				// Create a new user
				players.push(new player.newPlayer(io, socket, name));

				// Send that player has joined
				socket.emit("joined");
			}
			else if(!s) {
				// The player has been kicked since the name was already used
				socket.emit("kicked", "Name is already used!");
			}
		});

		socket.on('disconnect', function() {
			// Remove user from the players list and all other lists
			for(var n in players) {
				if(players[n].socket == socket) {
					// Remove name from list
					removeNumber(players[n].name);

					// Remove from players
					players.splice(n, n + 1);
				}
			}
		});
	});

	
}