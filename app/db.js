const path = require('path')
const Datastore = require('nedb')
const logger = require('./utils/loggerFactory')()
const deviceStatus = require('./deviceStatus')

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

  db.findOne({ sensorId }, (err, sensor) => {
    if (err) {
      logger.error(`Error finding sensor: ${err}`)
      reject(err)
    } else {
      const found = (sensor === null) ? 'not found' : 'found'
      logger.debug(`Sensor ${sensorId} ${found}`)
      resolve(sensor)
    }
  })
})

const addSensor = (identity) => new Promise((resolve, reject) => {
  const { sensorId, name = '', status = deviceStatus.SENSOR_PENDING } = identity

  if (!sensorId) {
    reject('DB:addSensor :: Not a sensor')
    return
  }

  db.insert({ sensorId, name, status }, (err, sensor) => {
    if (err) {
      logger.error(`Error adding sensor: ${err}`)
      reject(err)
    } else {
      logger.debug(`Sensor ${sensorId} inserted in DB. `)
      resolve(sensor)
    }
  })
})

module.exports = {
  findSensor,
  addSensor,
}
