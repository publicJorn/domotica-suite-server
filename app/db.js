const path = require('path')
const Datastore = require('nedb')
const logger = require('./utils/loggerFactory')()
const sensorTools = require('./sensorTools')

const db = new Datastore({
  filename: path.resolve(__dirname, '../db/dev-devices.db'),
  autoload: true,
})


const addSensor = (identity) => new Promise((resolve, reject) => {
  const parsedData = sensorTools.setDefaults(identity)

  if (!parsedData) {
    reject('Required params not set')
    return
  }

  db.insert(parsedData, (err, sensor) => {
    logger.debug(`Sensor ${parsedData.arduinoId} inserted in DB`)
    if (err) {
      reject(err)
    } else {
      resolve(sensor)
    }
  })
})

module.export = {
  addSensor,
}
