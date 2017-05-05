const logger = require('./utils/loggerFactory')()

module.exports = (socket) => {
  socket.on('identify', (...args) => {
    console.log(Object.keys(socket))
    console.log(args)
    logger.info(args.type)
  })
}
