jest.mock('../utils/loggerFactory')

const cfg = require('../config')
const logger = require('../utils/loggerFactory')()

test('bla', () => {
  expect(true).toBe(true)
})

// it('Should log a connection to the sensor endpoint', () => {})
// it('Should log a connection to the monitor endpoint', () => {})
