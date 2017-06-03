const deviceStatus = require('app/deviceStatus')

module.exports = {
  find: (identity) =>
    (identity.sensorId === 'known') ?
      Object.assign(identity, { status: deviceStatus.SENSOR_OK }) : null,

  add: (identity) =>
    Object.assign(identity, { status: deviceStatus.SENSOR_PENDING }),

  setStatus: (device, newStatus) =>
    Object.assign(device, { status: newStatus }),
}
