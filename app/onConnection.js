const logger = require('./utils/loggerFactory')()
const identify = require('./identify')

module.exports = (socket) => {
  logger.info(`${socket.id} connected`)
  console.log(Object.keys(socket))

  identify(socket)
}
