/**
 * See package.json
 * Currently using my own fork of `mock-socket` which implements `socket.to`.
 * If this never gets pulled into original project, I could probably rewrite
 * `socket.to().emit()` -> `socket.broadcast.to().emit()`.
 */
const MockServer = require('mock-socket').Server
const createMockSocket = require('mock-socket').SocketIO

module.exports = (url, done1) => {
  const mockServer = new MockServer(url)
  const mockSocket = createMockSocket(url, {
    forceNew: true,
    reconnection: false,
  })

  const catchy = (done2, assertFn) => {
    let done
    let assertion

    if (typeof assertFn !== 'function') {
      done = done1
      assertion = done2
    } else {
      done = done2
      assertion = assertFn
    }

    if (typeof done === 'undefined') {
      mockServer.stop()
      console.error('Function catchy does not have access to a `done` callback')
      return
    }

    try {
      assertion()
      mockServer.stop(done)
    } catch (e) {
      mockServer.stop(done.fail.bind(null, e))
    }
  }

  // mockSocket - The socket object on the server side
  // mockServer - The io/server object
  // catchy     - wrap assertions in this function for proper handling
  return { mockSocket, mockServer, catchy }
}
