const remove = require('lodash/remove')

module.exports = class {
  constructor () {
    this.clients = []
  }

  add (socket, device) {
    this.clients.push({ id: socket.id, device, socket })
  }

  remove (socketId) {
    remove(this.clients, (client) => client.id === socketId)
  }
}
