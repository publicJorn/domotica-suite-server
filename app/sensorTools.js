const logger = require('./utils/loggerFactory')()
const db = require('./db')
const deviceStatus = require('./deviceStatus')

/**
 * Identification
 * @param identity
 * @returns {*}
 */
async function checkSensor (identity) {
  logger.debug('Sensor identity check', identity)

  if (!identity.sensorId) {
    return Object.assign(identity, { status: deviceStatus.IDENTITY_ERROR })
  }

  let sensorData = await db.findSensor(identity)
  logger.debug('checkSensor found?', sensorData)

  if (!sensorData) {
    sensorData = await db.addSensor(identity)
    logger.debug('checkSensor added', sensorData)
  }

  return sensorData
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
  handleDisconnect,
}
