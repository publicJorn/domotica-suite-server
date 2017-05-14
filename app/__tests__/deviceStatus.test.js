const deviceStatus = require('../deviceStatus')

test('Device statuses should be as expected', () =>
  expect(deviceStatus).toMatchSnapshot()
)
