const logger = require('app/utils/loggerFactory')()
const db = require('app/db')
const deviceStatus = require('app/deviceStatus')
const checkSensor = require('app/sensorTools').checkSensor

jest.mock('app/utils/loggerFactory')
jest.mock('app/db')

const logDebugSpy = jest.spyOn(logger, 'debug')
const dbAddSpy = jest.spyOn(db, 'addSensor')

describe('When a sensor identity is checked', () => {
  it('Should log the sensor trying to identify', () => {
    const identity = { type: 'sensor', sensorId: 'some id' }
    checkSensor(identity)
    expect(logDebugSpy).toBeCalledWith(expect.any(String), identity)
  })

  describe('And sensorId is not set', () => {
    it('Should return identity with an error status', () => {
      const identity = { type: 'sensor' }
      const device = checkSensor(identity)

      expect(device).toEqual(expect.objectContaining({
        status: deviceStatus.IDENTITY_ERROR,
      }))
    })
  })

  describe('And sensor is unknown', () => {
    const identity = { type: 'sensor', sensorId: 'unknown' }
    const device = checkSensor(identity)

    it('Should add sensor to DB and set state to "pending"', () => {
      expect(dbAddSpy).toBeCalledWith(identity)
    })

    it('Should return an object containing "pending" status', () => {
      expect(device).toEqual(expect.objectContaining({
        status: deviceStatus.SENSOR_PENDING,
      }))
    })
  })

  describe('And sensor is known', () => {
    const identity = { type: 'sensor', sensorId: 'known' }
    const device = checkSensor(identity)

    it('Should return an object containing "identified" status', () => {
      expect(device).toEqual(expect.objectContaining({
        status: deviceStatus.SENSOR_OK,
      }))
    })
  })
})
