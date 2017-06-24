const cfg = require('config')
const mockIO = require('test-utils/mockIO')
const logger = require('app/utils/loggerFactory')()
const db = require('app/db')
const deviceStatus = require('app/deviceStatus')
const setListeners = require('app/setListeners')

jest.mock('../utils/loggerFactory')
jest.mock('app/db')
jest.mock('app/checkIdentity', () => {
  return jest.fn((socket, identity) => identity)
})

const dbSetStatusSpy = jest.spyOn(db, 'setSensorStatus')

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

describe('When identification is unsuccessful', () => {
  it('Should run the callback function with an error message', (done) => {
    const { mockSocket, mockServer, catchy } = mockIO(cfg.url, done)

    const cb = jest.fn()
    const assert = () => catchy(() => {
      expect(cb).toBeCalledWith(expect.objectContaining({
        error: deviceStatus.IDENTITY_ERROR,
      }))
    })

    setListeners(mockSocket)

    mockSocket.on('connect', () => {
      mockServer.emit('identify', {
        type: 'error',
        status: deviceStatus.IDENTITY_ERROR
      }, cb)
      setTimeout(assert, 50)
    })
  })
})

describe('When succesfully identified', () => {
  it('Should run the callback function without an error message and a device object reflecting status', (done) => {
    const { mockSocket, mockServer, catchy } = mockIO(cfg.url, done)

    const cb = jest.fn()
    const assert = () => catchy(() => {
      expect(cb).toBeCalledWith(expect.objectContaining({
        error: '',
        client: expect.objectContaining({ status: deviceStatus.SENSOR_PENDING }),
      }))
    })

    setListeners(mockSocket)

    mockSocket.on('connect', () => {
      mockServer.emit('identify', {
        type: 'sensor',
        status: deviceStatus.SENSOR_PENDING
      }, cb)
      setTimeout(assert, 50)
    })
  })

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

    it('Should emit "sensorlist" to monitors', (done) => {
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

// TODO: I think there's a bug in mock-socket > SocketIO.prototype.close
// TODO: the first dispatched event gets stuck somewhere. But even when commenting out the first,
// TODO: 'disconnect' event doesn't fire on mockSocket, so this case is not testable.
// describe('When a connection to sensor is lost', () => {
  // it('Should update sensor status in database if sensor is identified', (done) => {
  //   console.log('=> my test')
  //   const { mockSocket, mockServer, catchy } = mockIO(cfg.url, done)
  //
  //   const assert = () => catchy(() => {
  //     expect(dbSetStatusSpy).toBeCalledWith(
  //       expect.objectContaining({ type: expect.any(String) }),
  //       deviceStatus.SENSOR_UNCONNECTED
  //     )
  //   })
  //
  //   setListeners(mockSocket)
  //
  //   mockSocket.on('connect', () => {
  //     console.log('-> connect')
  //     mockServer.emit('identify', {
  //       type: 'sensor',
  //       status: deviceStatus.SENSOR_OK
  //     })
  //
  //     setTimeout(() => {
  //       console.log('-> disconnect')
  //       mockSocket.disconnect()
  //       console.log('-> disconnect 2')
  //       assert()
  //     }, 50)
  //   })
  // })

  // it('Should emit "sensorlist" to monitors', (done) => {
  //   const { mockSocket, mockServer, catchy } = mockIO(cfg.url)
  //   const toSpy = jest.spyOn(mockSocket, 'to')
  //   const emitSpy = jest.spyOn(mockServer, 'emit')
  //
  //   const assert = () => catchy(() => {
  //     expect(toSpy).toHaveBeenCalledWith('monitors')
  //     expect(emitSpy).toHaveBeenCalledWith(
  //       'sensorlist',
  //       expect.any(Array),
  //       expect.anything() // Used by mock-socket internally
  //     )
  //   })
  //
  //   mockSocket.disconnect()
  //
  // })
// })
