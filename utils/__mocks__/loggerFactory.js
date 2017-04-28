module.exports = () => {
  return {
    log: jest.fn(() => {console.log('MOCK log')}),
    debug: jest.fn(() => {console.log('MOCK debug')}),
    info: jest.fn(() => {console.log('MOCK info')}),
    warn: jest.fn(() => {console.log('MOCK warn')}),
    error: jest.fn(() => {console.log('MOCK error')}),
  }
}
