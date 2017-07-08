/**
 * Returning true means it's an error
 */
module.exports = class {
  find (obj, cb) {
    if (obj.sensorId === 'throw error') return cb(true)
    if (obj.sensorId === 'not found') return cb(false, [])
    return cb(false, [obj])
  }

  insert (obj, cb) {
    return cb(obj.sensorId === 'throw error', obj)
  }
}
