jest.mock('../utils/loggerFactory')

const mockIO = require('test-utils/mockIO')
const cfg = require('config')
const logger = require('app/utils/loggerFactory')()
const onConnection = require('app/onConnection')

it('Should add a log entry on a new connection', (done) => {
  const loggerSpy = jest.spyOn(logger, 'info')
  const { mockClient, mockServer, catchy } = mockIO(cfg.url, done)

  const assert = () => catchy(() => {
    expect(loggerSpy).toHaveBeenCalled()
  })

  mockServer.on('connect', onConnection)
  mockClient.on('connect', assert)
})
