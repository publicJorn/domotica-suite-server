const sensorTools = require('app/sensorTools')
const deviceStatus = require('app/deviceStatus')

const identity = { type: 'sensor', deviceId: '123' }

describe('checkSensor', () => {
  it('Should set name and status if not given', () => {
    const sensorDefaults = sensorTools.setDefaults(identity)
    expect(sensorDefaults).toEqual(expect.objectContaining({
      name: '',
      status: deviceStatus.SENSOR_PENDING,
    }))
  })
})
