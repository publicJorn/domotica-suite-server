jest.mock('../utils/loggerFactory')

const logger = require('app/utils/loggerFactory')()
const checkIdentity = require('../checkIdentity')

const logDebugSpy = jest.spyOn(logger, 'debug')
const logWarnSpy = jest.spyOn(logger, 'warn')

describe('When an identity request is made', () => {
  describe('And the identity data is erroneous', () => {
    const identity = { erroneous: 'identity' }

    test('It should log a warning with meta data', () => {
      checkIdentity(identity)
      expect(logWarnSpy).toBeCalledWith('Erroneous identity data', identity)
    })

    test('It should return an object with an error prop', () => {
      const device = checkIdentity(identity)

      expect(device).toEqual(expect.objectContaining({
        isKnown: false,
        error: expect.any(String),
      }))
    })
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
