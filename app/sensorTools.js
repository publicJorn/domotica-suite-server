const logger = require('./utils/loggerFactory')()
const db = require('./db')
const deviceStatus = require('./deviceStatus')

/**
 * Identification
 * @param identity
 * @returns {*}
 */
function checkSensor (identity) {
  logger.debug('Sensor identity check', identity)

  let sensorData = db.find(identity)

  if (!sensorData) {
    sensorData = db.add(identity)
  }

  return sensorData
}

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
  checkSensor,
  handleDisconnect
}
