jest.mock('../utils/loggerFactory')

const mockIO = require('test-utils/mockIO')
const cfg = require('config')
const logger = require('app/utils/loggerFactory')()
const identify = require('app/identify')

it('Should log any sensor identity', (done) => {
  const loggerSpy = jest.spyOn(logger, 'info')
  const { mockClient, mockServer, catchy } = mockIO(cfg.url, done)

  identify(mockServer)

  const assert = () => catchy(() => {
    expect(loggerSpy).toHaveBeenCalled()
  })

  //
  mockClient.on('connect', () => {
    mockClient.emit('identify', {
      type: 'sensor',
      deviceId: 'SomeSensorID',
    })

    setTimeout(assert, 100)
  })
})



// Should accept identity information from sensor
//
// When sensor is not known
//   Should return `pending identity`
//   Should add sensor to DB and set state to `pending`
//   Should emit `sensorlist` to monitors
// When sensor is known
//   Should return `identified` if
//   Should set sensor state in DB to `identified`
//   Should emit `sensorlist` to monitors

// Should accept identity information from monitor
// Should log any monitor identity
// Should return `not authorised` if credentials are incorrect
// Should return `sensorlist` if credentials are correct
