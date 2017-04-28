const io = require('socket.io-client')
const portInUse = require('../lib/portInUse')
const cfg = require('../config')

function connect (url) {
	return io(url, {
		forceNew: true,
		reconnection: false
	})
}

beforeAll(() => {
  portInUse(cfg, function(isRunning) {
    if (!isRunning) {
      console.error('FOR THE CONNECTIONS TEST THE SERVER SHOULD SPIN!')
    }
  })
})

describe('connection endpoint', () => {
	it('Should have a special sensor namespace', (done) => {
		const socket = connect(cfg.sensorUrl)
		socket.on('connect', () => {
			expect(socket).toHaveProperty('id')
			socket.disconnect()
			done()
		})
	}, 1000) // Cap at 1 second

	it('Should send confirmation on connecting sensor', (done) => {
		const socket = connect(cfg.sensorUrl)
		socket.on('request-identity', ({ status }) => {
			expect(status).toEqual('ok')
			socket.disconnect()
			done()
		})
	}, 1000)

	it('Should have a special monitor namespace', (done) => {
    const socket = connect(cfg.monitorUrl)
    socket.on('connect', () => {
      expect(socket).toHaveProperty('id')
      socket.disconnect()
      done()
    })
  }, 1000)

	it('Should send confirmation on connecting monitor', (done) => {
    const socket = connect(cfg.monitorUrl)
    socket.on('request-identity', ({ status }) => {
      expect(status).toEqual('ok')
      socket.disconnect()
      done()
    })
  }, 1000)
})
