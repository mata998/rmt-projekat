const GameState = require("./gamestate/GameState");

class GameRoom {
  constructor(roomName) {
    this.roomName = roomName;
    this.numOfPlayers = 0;
    this.visible = true;
    this.playerSockets = [undefined, undefined];
    this.gameState = new GameState();
  }

  connect(socket) {
    if (this.numOfPlayers == 2) {
      return -1;
    } else {
      this.numOfPlayers++;

      if (this.numOfPlayers === 2) {
        this.visible = false;
      }

      if (this.playerSockets[0] == undefined) {
        this.playerSockets[0] = socket;
        return 0;
      } else {
        this.playerSockets[1] = socket;
        return 1;
      }
    }
  }

  kickUser(socketID) {
    for (let i = 0; i < 2; i++) {
      if (this.playerSockets[i] && this.playerSockets[i].id == socketID) {
        this.playerSockets[i] = undefined;

        this.numOfPlayers--;

        if (this.numOfPlayers === 0) {
          this.visible = true;
        }

        return;
      }
    }
  }

  reset() {
    this.numOfPlayers = 0;
    this.playerSockets = [];
    this.gameState.reset();
  }
}

module.exports = GameRoom;
