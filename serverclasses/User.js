let users = [];

class User {
  constructor(socket, roomName, playerType) {
    this.socket = socket;
    this.roomName = roomName;
    this.playerType = playerType;
  }

  static add(newUser) {
    users.push(newUser);
  }

  static delete(socketID) {
    let deletedUser;

    users = users.filter((user) => {
      if (user.socket.id === socketID) {
        deletedUser = user;
        return false;
      } else {
        return true;
      }
    });

    return deletedUser;
  }

  static getUser(socketID) {
    return users.filter((user) => user.socket.id === socketID)[0];
  }

  static getUsers() {
    return users;
  }

  static setUsers(newUsers) {
    users = newUsers;
  }
}

module.exports = User;
