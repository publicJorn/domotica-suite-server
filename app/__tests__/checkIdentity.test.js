const logger = require('app/utils/loggerFactory')()
const db = require('app/db')
const deviceStatus = require('app/deviceStatus')
const checkIdentity = require('../checkIdentity')

jest.mock('app/utils/loggerFactory')
jest.mock('app/db')

const logDebugSpy = jest.spyOn(logger, 'debug')
const logWarnSpy = jest.spyOn(logger, 'warn')
const dbAddSpy = jest.spyOn(db, 'add')

describe('When a sensor identity is checked', () => {
  it('Should log the sensor trying to identify', () => {
    const identity = { type: 'sensor', sensorId: 'some id' }
    checkIdentity(identity)
    expect(logDebugSpy).toBeCalledWith(expect.any(String), identity)
  })

  describe('And sensor is unknown', () => {
    const identity = { type: 'sensor', sensorId: 'unknown' }
    const device = checkIdentity(identity)

    it('Should add sensor to DB and set state to `pending`', () => {
      expect(dbAddSpy).toBeCalledWith(identity)
    })

    it('Should return `pending identity`', () => {
      expect(device).toEqual(expect.objectContaining({
        status: deviceStatus.SENSOR_PENDING,
      }))
    })
  })
})

describe('When any other identity request is made', () => {
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