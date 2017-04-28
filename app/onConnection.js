const logger = require('../utils/loggerFactory')()

module.exports = (client) => {
  logger.info(`${client.id} connected`)
  client.emit('request-identity', { status: 'ok' })
}
