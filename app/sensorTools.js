const db = require('./db')
const deviceStatus = require('./deviceStatus')

/**
 * Only set SENSOR_UNCONNECTED if it is registered
 * @param device
 */
function handleDisconnect (device) {
  if (device.status !== deviceStatus.SENSOR_PENDING) {
    db.setStatus(device, deviceStatus.SENSOR_UNCONNECTED)
  }
}

module.exports = {
  handleDisconnect
}
