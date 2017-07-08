const deviceStatus = require('app/deviceStatus')

module.exports = {
  findSensor: (identity) => (
    (
      identity.type === 'sensor' &&
      identity.sensorId &&
      identity.sensorId === 'known' // simple id for test
    ) ?
      Object.assign(identity, { status: deviceStatus.SENSOR_OK }) : null
  ),

  addSensor: (identity) =>
    Object.assign(identity, { status: deviceStatus.SENSOR_PENDING }),

  setSensorStatus: (device, newStatus) =>
    Object.assign(device, { status: newStatus }),

  findMonitorByName: (name) => (
    (name === 'ok') ? { name: 'ok', pass: 'ok' } : null
  ),
}
