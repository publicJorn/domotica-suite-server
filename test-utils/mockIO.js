const MockServer = require('mock-socket').Server
const socketIO = require('mock-socket').SocketIO

module.exports = (url, done) => {
  const mockServer = new MockServer(url)
  const mockClient = socketIO(url, {
    forceNew: true,
    reconnection: false,
  })

  const catchy = (assertion) => {
    try {
      assertion()
      mockServer.stop(done)
    } catch (e) {
      mockServer.stop(done.fail.bind(null, e))
    }
  }

  return { mockClient, mockServer, catchy }
}
