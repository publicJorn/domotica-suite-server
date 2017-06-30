const mockLog = jest.fn()
const mockDebug = jest.fn()
const mockInfo = jest.fn()
const mockWarn = jest.fn()
const mockError = jest.fn()

module.exports = () => ({
  log: mockLog,
  debug: mockDebug,
  info: mockInfo,
  warn: mockWarn,
  error: mockError,
})
