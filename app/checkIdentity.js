const logger = require('./utils/loggerFactory')()
const deviceStatus = require('./deviceStatus')
const sensorTools = require('./sensorTools')
const monitorTools = require('./monitorTools')

module.exports = (identity) => {
  switch (identity.type) {
    case 'sensor':
      return sensorTools.checkSensor(identity)

    case 'monitor':
      return monitorTools.checkMonitor(identity)

    default:
      return handleError(identity)
  }
}

function handleError (identity) {
  const errorMsg = 'Erroneous identity data'
  const deviceData = Object.assign(identity, {
    status: deviceStatus.IDENTITY_ERROR,
    error: errorMsg,
  })

  logger.warn(errorMsg, deviceData)
  return deviceData
}
