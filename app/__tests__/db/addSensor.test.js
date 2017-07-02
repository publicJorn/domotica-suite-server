const logger = require('app/utils/loggerFactory')()
const db = require('app/db')

jest.mock('app/utils/loggerFactory')
jest.mock('nedb')

const logDebugSpy = jest.spyOn(logger, 'debug')
const logErrorSpy = jest.spyOn(logger, 'error')
const insertSpy = jest.spyOn(db.nedbMockInstance, 'insert')

/**
 * Note: addSensor has some overlap with setDefaults. But this function is so simple (and has tests)
 * that I haven't mocked it.
 */
describe('Database API : addSensor', () => {
  it('Should fail if required params are not set', () => {
    expect.assertions(1)

    const incompleteIdentity = { type: 'sensor' }
    return expect(db.addSensor(incompleteIdentity)).rejects.toBeDefined()
  })

  describe('a successful add operation', () => {
    const properIdentity = { type: 'sensor', sensorId: 'some id' }
    const addPromise = db.addSensor(properIdentity)

    it('Should insert into database', async () => {
      expect.assertions(1)
      await expect(insertSpy).toHaveBeenCalled()
    })

    it('Should resolve', async () => {
      expect.assertions(1)
      await expect(addPromise).resolves.toBeDefined()
    })

    it('Should log a debug message', async () => {
      expect.assertions(1)
      await expect(logDebugSpy).toBeCalledWith(expect.any(String))
    })
  })

  describe('an error in the insert operation', () => {
    const properIdentity = { type: 'sensor', sensorId: 'throw error' }
    const addPromise = db.addSensor(properIdentity)

    it('Should reject', async () => {
      expect.assertions(1)
      await expect(addPromise).rejects.toBeDefined()
    })

    it('Should log an error message', async () => {
      expect.assertions(1)
      await expect(logErrorSpy).toBeCalledWith(expect.any(String))
    })
  })
})
