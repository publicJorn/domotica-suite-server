const deviceStatus = require('app/deviceStatus')

module.exports = {
  find: (identity) =>
    (
      identity.type === 'sensor' &&
      identity.sensorId &&
      identity.sensorId === 'known' // simple id for test
    ) ?
      Object.assign(identity, { status: deviceStatus.SENSOR_OK }) : null,

  findMonitorByName: (name) =>
    (name === 'ok') ? { name: 'ok', pass: 'ok' } : null,

  add: (identity) =>
    Object.assign(identity, { status: deviceStatus.SENSOR_PENDING }),

  setStatus: (device, newStatus) =>
    Object.assign(device, { status: newStatus }),
}
