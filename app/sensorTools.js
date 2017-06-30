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

  if (!identity.sensorId) {
    return Object.assign(identity, { status: deviceStatus.IDENTITY_ERROR })
  }

  let sensorData = db.findSensor(identity)

  if (!sensorData) {
    sensorData = db.addSensor(identity)
  }

  return sensorData
}

/**
 * Set default database values for new sensors
 * @param identity
 */
function setDefaults (identity) {
  const { sensorId, name = '', status = deviceStatus.SENSOR_PENDING } = identity
  return { sensorId, name, status }
}

/**
 * Only set SENSOR_UNCONNECTED if it is registered
 * @param device
 */
function handleDisconnect (device) {
  if (device.status !== deviceStatus.SENSOR_PENDING) {
    db.setSensorStatus(device, deviceStatus.SENSOR_UNCONNECTED)
  }
}

module.exports = {
  checkSensor,
  setDefaults,
  handleDisconnect,
}
