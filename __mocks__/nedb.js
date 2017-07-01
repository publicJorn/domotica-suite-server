module.exports = class {
  insert (obj, cb) {
    return cb(obj.sensorId === 'throw error', obj)
  }
}
