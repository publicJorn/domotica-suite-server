const path = require('path')
const Datastore = require('nedb')
const logger = require('./utils/loggerFactory')()
const sensorTools = require('./sensorTools')

const file = (process.env.NODE_ENV === 'production') ? 'devices.db' : 'dev-devices.db'
const db = new Datastore({
  filename: path.resolve(__dirname, `../db/${file}`),
  autoload: true,
})

const findSensor = (identity) => new Promise((resolve, reject) => {
  const { type, sensorId } = identity

  if (type !== 'sensor' || !sensorId) {
    reject('Required data not found on identity')
  }

  db.find({ type, sensorId }, (err, sensor) => {
    if (err) {
      logger.error(`Error finding sensor: ${err}`)
      reject(err)
    } else {
      if (sensor.length) {
        logger.debug(`Sensor ${sensorId} found`)
      } else {
        logger.warn(`Sensor ${sensorId} not found`)
      }
      resolve(sensor)
    }
  })
})

const addSensor = (identity) => new Promise((resolve, reject) => {
  const parsedData = sensorTools.setDefaults(identity)

  if (!parsedData) {
    reject('Required params not set')
    return
  }

  db.insert(parsedData, (err, sensor) => {
    if (err) {
      logger.error(`Error adding sensor: ${err}`)
      reject(err)
    } else {
      logger.debug(`Sensor with id '${parsedData.sensorId}' inserted in DB`)
      resolve(sensor)
    }
  })
})

module.exports = {
  findSensor,
  addSensor,
}
