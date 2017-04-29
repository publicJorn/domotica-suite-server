jest.mock('../utils/loggerFactory')

const mockIO = require('test-utils/mockIO')
const cfg = require('config')
const logger = require('app/utils/loggerFactory')()
const onConnection = require('app/onConnection')

it('Should add a log entry on a new connection', (done) => {
  const loggerSpy = jest.spyOn(logger, 'info')
  const { mockClient, mockServer } = mockIO(cfg.url, onConnection)

  mockClient.on('connect', () => {
    try {
      expect(loggerSpy).toHaveBeenCalled()
      mockServer.stop(done)
    } catch (e) {
      mockServer.stop(done.fail.bind(null, e))
    }
  })
})
