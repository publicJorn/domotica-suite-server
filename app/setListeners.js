const logger = require('./utils/loggerFactory')()
const deviceStatus = require('./deviceStatus')
const ConnectedClients = require('./ConnectedClients.class')
const checkIdentity = require('./checkIdentity')
const sensorTools = require('./sensorTools')

const sockets = new ConnectedClients()

/**
 * Note: mockSocket doesn't allow testing disconnect; See `setListeners.test.js` for details
 * @param socket
 */
module.exports = (socket) => {
  logger.info(`${socket.id} connected`)

  socket.on('identify', async (identity, cbIdentify) => {
    const client = await checkIdentity(identity)

    if (
      client.status === deviceStatus.IDENTITY_ERROR ||
      client.status === deviceStatus.MONITOR_LOGIN_ERROR
    ) {
      /* istanbul ignore else */
      if (cbIdentify) cbIdentify({ error: client.status, client })
      logger.debug(`Invalid credentials, disonnecting: ${socket.id}`)
      socket.disconnect()
      return 'Error'
    }

    sockets.add(socket, client) // TODO: Check if we can we use `namespace.connected` or `namespace.clients` instead?
    /* istanbul ignore next */
    socket.on('disconnect', () => sockets.remove(socket.id))

    // Script will exit if case is not 'sensor' or 'monitor', so default will never occur
    // eslint-disable-next-line default-case
    switch (client.type) {
      case 'sensor':
        if (client.status === deviceStatus.SENSOR_OK) {
          socket.on('alert', (...args) => console.log('alert', args)) // TODO
        }

        /* istanbul ignore next */
        socket.on('disconnect', () => {
          sensorTools.handleDisconnect(client)
          socket.to('monitors').emit('sensorlist', ['todo', 'sensors'])
        })
        socket.to('monitors').emit('sensorlist', ['todo', 'sensors'])
        break

      case 'monitor':
        // console.log('\n\n --------- \n\n')
        // console.log(Object.keys(socket))
        // console.log('\n\n ========= \n\n')

        socket.on('saveSensorData', (...args) => console.log('saveSensorData', args)) // TODO
        socket.on('affirm', (...args) => console.log('affirm', args)) // TODO
        socket.join('monitors')
        break
    }

    if (cbIdentify) cbIdentify({ error: '', client })
    return 'Ok'
  })
}
