const logger = require('./utils/loggerFactory')()
const deviceStatus = require('./deviceStatus')
const ConnectedClients = require('./ConnectedClients.class')
const checkIdentity = require('./checkIdentity')

const sockets = new ConnectedClients()

module.exports = (socket) => {
  logger.info(`${socket.id} connected`)

  socket.on('identify', async (identity) => {
    const device = await checkIdentity(socket, identity)

    if (device.status === deviceStatus.IDENTITY_ERROR) {
      socket.emit('error', { device }) // Or in return fn?
      return
    }

    sockets.add(socket, device) // TODO: Check if we can we use `namespace.connected` or `namespace.clients` instead?
    socket.on('disconnect', () => sockets.remove(socket.id))

    switch (device.type) {
      case 'sensor':
        if (device.status === deviceStatus.SENSOR_OK) {
          socket.on('alert', (...args) => console.log('alert', args))
        }

        socket.to('monitors').emit('sensorlist', ['sensors'])
        break

      case 'monitor':
        // TODO: if credentials ok
        socket.on('saveSensorData', (...args) => console.log('saveSensorData', args))
        socket.on('affirm', (...args) => console.log('affirm', args))
        socket.join('monitors')
        break
    }
  })
}
