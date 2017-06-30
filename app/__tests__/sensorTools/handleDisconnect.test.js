const db = require('app/db')
const deviceStatus = require('app/deviceStatus')
const handleDisconnect = require('app/sensorTools').handleDisconnect

jest.mock('app/db')

const dbSetSpy = jest.spyOn(db, 'setSensorStatus')

describe('handleDisconnect()', () => {
  it('Should not change db entry if the sensor still has status PENDING', () => {
    const device = {
      type: 'sensor',
      sensorId: 'some id',
      name: '',
      status: deviceStatus.SENSOR_PENDING,
    }

    handleDisconnect(device)
    expect(dbSetSpy).not.toHaveBeenCalled()
  })

  it('Should change db entry if the sensor is registered', () => {
    const device = {
      type: 'sensor',
      sensorId: 'some id',
      name: 'some name',
      status: deviceStatus.SENSOR_OK,
    }

    handleDisconnect(device)
    expect(dbSetSpy).toHaveBeenCalledWith(device, deviceStatus.SENSOR_UNCONNECTED)
  })
})
