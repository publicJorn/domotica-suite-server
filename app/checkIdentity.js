const logger = require('./utils/loggerFactory')()
const db = require('./db')
const deviceStatus = require('./deviceStatus')

const logMessages = {
  sensorConnects: 'Sensor identity check',
  badIdentity: 'Erroneous identity data',
}

module.exports = (identity) => {
  switch (identity.type) {
    case 'sensor':
      return checkSensor(identity)

    default:
      return handleError(identity)
  }
}

function checkSensor (identity) {
  logger.debug(logMessages.sensorConnects, identity)

  let sensorData = db.find(identity)

  if (!sensorData) {
    sensorData = db.add(identity)
  }

  return sensorData
}

function handleError (identity) {
  const deviceData = Object.assign(identity, {
    status: deviceStatus.IDENTITY_ERROR,
    error: logMessages.badIdentity,
  })

  logger.warn(logMessages.badIdentity, deviceData)
  return deviceData
}
