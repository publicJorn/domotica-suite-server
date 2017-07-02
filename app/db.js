const path = require('path')
const Datastore = require('nedb')
const logger = require('./utils/loggerFactory')()
const sensorTools = require('./sensorTools')

const file = (process.env.NODE_ENV === 'production') ? 'devices.db' : 'dev-devices.db'
const db = new Datastore({
  filename: path.resolve(__dirname, `../db/${file}`),
  autoload: true,
})

const addSensor = (identity) => new Promise((resolve, reject) => {
  const parsedData = sensorTools.setDefaults(identity)

  if (!parsedData) {
    reject('Required params not set')
    return
  }

  db.insert(parsedData, (err, sensor) => {
    if (err) {
      logger.error(`There was an error: ${err}`)
      reject(err)
    } else {
      logger.debug(`Sensor with id '${parsedData.sensorId}' inserted in DB`)
      resolve(sensor)
    }
  })
})

// Expose the datastore when testing
const nedbMockInstance = (process.env.NODE_ENV === 'test') ? { nedbMockInstance: db } : {}
module.exports = Object.assign({}, nedbMockInstance, {
  addSensor,
})
