class GameRoom {
  constructor(roomName) {
    this.roomName = roomName;
    this.numOfPlayers = 0;
    this.playerSockets = [];
  }

  connect(socket) {
    if (this.numOfPlayers == 2) {
      return -1;
    } else {
      this.numOfPlayers++;
      this.playerSockets.push(socket);
      return this.numOfPlayers - 1;
    }
  }

  reset() {
    this.numOfPlayers = 0;
    this.playerSockets = [];
  }
}

module.exports = GameRoom;
