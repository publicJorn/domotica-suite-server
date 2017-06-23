const logger = require('./utils/loggerFactory')()
const db = require('./db')
const deviceStatus = require('./deviceStatus')

/**
 * Identification
 * @param identity
 * @returns {*}
 */
function checkMonitor (identity) {
  logger.debug('Monitor identity check', identity)

  let pass
  let monitorData

  try {
    pass = identity.credentials.pass
    monitorData = db.findMonitorByName(identity.credentials.name)
  } catch (err) {
    return Object.assign(identity, { status: deviceStatus.MONITOR_LOGIN_ERROR })
  }

  if (monitorData && monitorData.pass === pass) {
    return Object.assign(identity, { status: deviceStatus.MONITOR_OK })
  } else {
    return Object.assign(identity, { status: deviceStatus.MONITOR_LOGIN_ERROR })
  }
}

module.exports = {
  checkMonitor
}
