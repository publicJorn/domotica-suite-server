jest.mock('../utils/loggerFactory')

const mockIO = require('test-utils/mockIO')
const cfg = require('config')
const logger = require('app/utils/loggerFactory')()
const setListeners = require('app/setListeners')

jest.mock('app/checkIdentity', () => {
  return jest.fn((socket, identity) => identity)
})

describe('When a new connection is made', () => {
  test('It should add a log entry', (done) => {
    const loggerSpy = jest.spyOn(logger, 'info')
    const { mockClient, mockServer, catchy } = mockIO(cfg.url, done)

    const assert = () => catchy(() => {
      expect(loggerSpy).toHaveBeenCalled()
    })

    setListeners(mockServer)
    mockClient.on('connect', assert)
  })

  test('It should listen to the `identify` event', (done) => {
    const { mockClient, mockServer, catchy } = mockIO(cfg.url, done)

    const assert = () => catchy(() => {
      expect(mockServer.listeners.identify).toBeDefined()
    })

    setListeners(mockServer)
    mockClient.on('connect', assert)
  })
})

describe('When succesfully identified', () => {
  test('A connected sensor should be listened to for expected events', (done) => {
    const { mockClient, mockServer, catchy } = mockIO(cfg.url, done)

    const assert = () => catchy(() => {
      expect(mockServer.listeners.alert).toBeDefined()
    })

    setListeners(mockServer)
    mockClient.on('connect', () => {
      mockClient.emit('identify', { type: 'sensor', isKnown: true })
      setTimeout(assert, 50)
    })
  })

  test('A connected monitor should be listened to for expected events', (done) => {
    const { mockClient, mockServer, catchy } = mockIO(cfg.url, done)

    const assert = () => catchy(() => {
      expect(Object.keys(mockServer.listeners)).toEqual(
        expect.arrayContaining(['saveSensorData', 'affirm'])
      )
    })

    setListeners(mockServer)
    mockClient.on('connect', () => {
      mockClient.emit('identify', { type: 'monitor', isKnown: true })
      setTimeout(assert, 50)
    })
  })
})
