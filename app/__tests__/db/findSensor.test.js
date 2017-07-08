const logger = require('app/utils/loggerFactory')()
const db = require('app/db')

jest.mock('app/utils/loggerFactory')
jest.mock('nedb')

const logDebugSpy = jest.spyOn(logger, 'debug')
const logWarnSpy = jest.spyOn(logger, 'warn')
const logErrorSpy = jest.spyOn(logger, 'error')

describe('Database API : findSensor', () => {
  it('Should fail if required params are not set', async () => {
    expect.assertions(2)

    const wrongTypeIdentity = { type: 'error', sensorId: 'type error' }
    const noIdIdentity = { type: 'sensor' }

    await Promise.all([
      expect(db.findSensor(noIdIdentity)).rejects.toBeDefined(),
      expect(db.findSensor(wrongTypeIdentity)).rejects.toBeDefined(),
    ])
  })

  describe('When a sensor exists', () => {
    const existingSensor = {
      type: 'sensor',
      sensorId: 'existing sensor',
    }
    const findPromise = db.findSensor(existingSensor)

    it('Should be returned', async () => {
      expect.assertions(1)
      // nedb find mock will return it's search criteria in an array
      await expect(findPromise).resolves.toEqual([existingSensor])
    })

    it('Should log a debug message ', async () => {
      expect.assertions(1)
      await expect(logDebugSpy).toHaveBeenCalledWith(expect.any(String))
    })
  })

  describe('When a sensor doesn\'t exist', () => {
    const nonExistingSensor = {
      type: 'sensor',
      sensorId: 'not found',
    }
    const findPromise = db.findSensor(nonExistingSensor)

    it('Should return an empty array', async () => {
      expect.assertions(1)
      await expect(findPromise).resolves.toEqual([])
    })

    it('Should log a warning', async () => {
      expect.assertions(1)
      await expect(logWarnSpy).toHaveBeenCalledWith(expect.any(String))
    })
  })

  describe('When a database error occurs', () => {
    const someSensor = {
      type: 'sensor',
      sensorId: 'throw error',
    }
    const findPromise = db.findSensor(someSensor)

    it('Should fail', async () => {
      expect.assertions(1)
      await expect(findPromise).rejects.toBeDefined()
    })

    it('Should log an error', async () => {
      expect.assertions(1)
      await expect(logErrorSpy).toHaveBeenCalledWith(expect.any(String))
    })
  })
})
