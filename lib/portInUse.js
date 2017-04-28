const net = require('net')

function portInUse ({ port, domain = '0.0.0.0' }, callback) {
  const server = net.createServer(function(socket) {
    socket.write('Echo server\r\n')
    socket.pipe(socket)
  })

  server.listen(port, domain)
  server.on('error', () => {
    callback(true)
  })
  server.on('listening', () => {
    server.close()
    callback(false)
  })
}

module.exports = portInUse
