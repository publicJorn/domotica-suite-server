const logger = require('./utils/loggerFactory')()

module.exports = (socket) => {
  logger.info(`${socket.id} connected`)
  logger.info(Object.keys(socket))

  socket.emit('request-identity', { status: 'ok' })
}
