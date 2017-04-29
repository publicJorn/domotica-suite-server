const MockServer = require('mock-socket').Server
const mockIO = require('mock-socket').SocketIO

module.exports = (url, fn) => {
  const mockServer = new MockServer(url)
  mockServer.on('connect', fn)

  const mockClient = mockIO(url, {
    forceNew: true,
    reconnection: false,
  })

  return { mockClient, mockServer }
}
