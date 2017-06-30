const logger = require('app/utils/loggerFactory')()
const deviceStatus = require('app/deviceStatus')
const checkMonitor = require('app/monitorTools').checkMonitor

jest.mock('app/utils/loggerFactory')
jest.mock('app/db')

const logDebugSpy = jest.spyOn(logger, 'debug')

describe('When a monitor identity is checked', () => {
  describe('When identity info is incorrect', () => {
    const identity = { type: 'monitor' }
    const monitor = checkMonitor(identity)

    it('Should log the monitor attempting to identify', () => {
      expect(logDebugSpy).toBeCalledWith(expect.any(String), identity)
    })

    // Not a general error; Give 'em as few clues as possible!
    it('Should return a login error', () => {
      expect(monitor).toEqual(expect.objectContaining({
        status: deviceStatus.MONITOR_LOGIN_ERROR,
      }))
    })
  })

  describe('And while testing credentials', () => {
    describe('The name doesn\'t exist', () => {
      it('Should return a login error', () => {
        const identity = { type: 'monitor', credentials: { name: 'nok', pass: 'nok' } }
        const monitor = checkMonitor(identity)

        expect(monitor).toEqual(expect.objectContaining({
          status: deviceStatus.MONITOR_LOGIN_ERROR,
        }))
      })
    })

    describe('The name exists, but pass is wrong', () => {
      it('Should return a login error', () => {
        const identity = { type: 'monitor', credentials: { name: 'ok', pass: 'nok' } }
        const monitor = checkMonitor(identity)

        expect(monitor).toEqual(expect.objectContaining({
          status: deviceStatus.MONITOR_LOGIN_ERROR,
        }))
      })
    })
  })

  describe('When credentials are correct', () => {
    it('Should return an ok status', () => {
      const identity = { type: 'monitor', credentials: { name: 'ok', pass: 'ok' } }
      const monitor = checkMonitor(identity)

      expect(monitor).toEqual(expect.objectContaining({
        status: deviceStatus.MONITOR_OK,
      }))
    })
  })
})
