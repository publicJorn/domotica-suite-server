const sensorTools = require('app/sensorTools')
const deviceStatus = require('app/deviceStatus')

describe('checkSensor', () => {
  it('Should set name and status if not given', () => {
    const sensorDefaults = sensorTools.setDefaults({ type: 'sensor', sensorId: '123' })

    expect(sensorDefaults).toEqual(expect.objectContaining({
      name: '',
      status: deviceStatus.SENSOR_PENDING,
    }))
  })

  it('Should return undefined if no sensorId is given', () => {
    const sensorDefaults = sensorTools.setDefaults({ type: 'sensor' })
    expect(sensorDefaults).toEqual(undefined)
  })
})
