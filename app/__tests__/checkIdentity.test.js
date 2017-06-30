const logger = require('app/utils/loggerFactory')()
const deviceStatus = require('app/deviceStatus')
const checkIdentity = require('../checkIdentity')

jest.mock('app/utils/loggerFactory')
jest.mock('app/db')

const logWarnSpy = jest.spyOn(logger, 'warn')

const sensorTools = require('app/sensorTools')
const monitorTools = require('app/monitorTools')
const checkSensorSpy = jest.spyOn(sensorTools, 'checkSensor')
const checkMonitorSpy = jest.spyOn(monitorTools, 'checkMonitor')

describe('When a sensor identity is checked', () => {
  it('Should call sensorTools.checkSensor', () => {
    const identity = { type: 'sensor', sensorId: 'some id' }
    checkIdentity(identity)
    expect(checkSensorSpy).toHaveBeenCalledWith(identity)
  })
})

describe('When a monitor identity is checked', () => {
  it('Should call monitorTools.checkMonitor', () => {
    const identity = { type: 'monitor' }
    checkIdentity(identity)
    expect(checkMonitorSpy).toHaveBeenCalledWith(identity)
  })
})


describe('When an unknonwn identity request is made', () => {
  const identity = { erroneous: 'identity' }

  it('Should log a warning with meta data', () => {
    checkIdentity(identity)
    expect(logWarnSpy).toBeCalledWith(expect.any(String), identity)
  })

  it('Should return an object with an error prop', () => {
    const device = checkIdentity(identity)

    expect(device).toEqual(expect.objectContaining({
      status: deviceStatus.IDENTITY_ERROR,
      error: expect.any(String),
    }))
  })
})
