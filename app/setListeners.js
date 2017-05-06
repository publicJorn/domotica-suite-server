const logger = require('./utils/loggerFactory')()
const checkIdentity = require('./checkIdentity')

module.exports = (socket) => {
  logger.info(`${socket.id} connected`)

  socket.on('identify', async (identity) => {
    const device = await checkIdentity(socket, identity)

    if (!device.isKnown) return

    switch (device.type) {
      case 'sensor':
        socket.on('alert', (...args) => console.log('alert', args))
        break;

      case 'monitor':
        socket.on('saveSensorData', (...args) => console.log('saveSensorData', args))
        socket.on('affirm', (...args) => console.log('affirm', args))
        break;
    }
  })
}
