const logger = require('./utils/loggerFactory')()

const errors = {
  identityProps: 'Erroneous identity data',
}

module.exports = (identity) => {
  if (!identity.type) {
    const deviceData = Object.assign(identity, {
      isKnown: false,
      error: errors.identityProps,
    })

    logger.warn(errors.identityProps, deviceData)
    return deviceData
  }
}
