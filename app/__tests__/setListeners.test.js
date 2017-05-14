jest.mock('../utils/loggerFactory')

const cfg = require('config')
const mockIO = require('test-utils/mockIO')
const logger = require('app/utils/loggerFactory')()
const deviceStatus = require('app/deviceStatus')
const setListeners = require('app/setListeners')

jest.mock('app/checkIdentity', () => {
  return jest.fn((socket, identity) => identity)
})

describe('When a new connection is made', () => {
  it('Should add a log entry', (done) => {
    const { mockSocket, catchy } = mockIO(cfg.url, done)
    // const client = ioClient.connect(cfg.url, clientOpts)
    const loggerSpy = jest.spyOn(logger, 'info')

    const assert = () => catchy(() => {
      expect(loggerSpy).toHaveBeenCalled()
    })

    setListeners(mockSocket)
    mockSocket.on('connect', assert)
  })

  it('Should listen to the `identify` event', (done) => {
    const { mockSocket, catchy } = mockIO(cfg.url, done)

    const assert = () => catchy(() => {
      expect(mockSocket.listeners.identify).toBeDefined()
    })

    setListeners(mockSocket)
    mockSocket.on('connect', assert)
  })
})

describe('When succesfully identified', () => {
  describe('A connected sensor', () => {
    it('Should be listened to for expected events', (done) => {
      const { mockSocket, mockServer, catchy } = mockIO(cfg.url, done)

      const assert = () => catchy(() => {
        expect(mockSocket.listeners.alert).toBeDefined()
      })

      setListeners(mockSocket)

      mockSocket.on('connect', () => {
        mockServer.emit('identify', {
          type: 'sensor',
          status: deviceStatus.SENSOR_OK
        })
        setTimeout(assert, 50)
      })
    })

    it('Should emit `sensorlist` to monitors', (done) => {
      const { mockSocket, mockServer, catchy } = mockIO(cfg.url, done)
      const toSpy = jest.spyOn(mockSocket, 'to')
      const emitSpy = jest.spyOn(mockServer, 'emit')

      const assert = () => catchy(() => {
        expect(toSpy).toHaveBeenCalledWith('monitors')
        expect(emitSpy).toHaveBeenCalledWith(
          'sensorlist',
          expect.any(Array),
          expect.anything() // Used by mock-socket internally
        )
      })

      setListeners(mockSocket)

      mockSocket.on('connect', () => {
        mockServer.emit('identify', {
          type: 'sensor',
          status: deviceStatus.SENSOR_OK
        })
        setTimeout(assert, 50)
      })
    })
  })

  describe('A connected monitor', () => {
    it('Should be listened to for expected events', (done) => {
      const { mockSocket, mockServer, catchy } = mockIO(cfg.url, done)

      const assert = () => catchy(() => {
        expect(Object.keys(mockSocket.listeners)).toEqual(
          expect.arrayContaining(['saveSensorData', 'affirm'])
        )
      })

      setListeners(mockSocket)

      mockSocket.on('connect', () => {
        mockServer.emit('identify', {
          type: 'monitor',
          status: deviceStatus.MONITOR_OK
        })
        setTimeout(assert, 50)
      })
    })
  })
})
