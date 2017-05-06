const MockServer = require('mock-socket').Server
const socketIO = require('mock-socket').SocketIO

module.exports = (url, done1) => {
  const mockServer = new MockServer(url)
  const mockClient = socketIO(url, {
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
      return undefined
    }

    try {
      assertion()
      mockServer.stop(done)
    } catch (e) {
      mockServer.stop(done.fail.bind(null, e))
    }
  }

  return { mockClient, mockServer, catchy }
}
