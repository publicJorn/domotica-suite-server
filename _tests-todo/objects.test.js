// sensorlist
// Should be an empty array if there are no sensors in DB and none connected
// Should be a collection of (1) sensor object if there is a sensor in DB and no sensors are connected
// Should be a collection of (1) sensor object if an unidentified sensor is connected
// Should be a collection of (2) sensor objects if an identified sensor is not connected and one unidentified sensor is connected

// sensorObject
// Should have expected properties => keys: ['id', 'sensorId', 'name', 'description', 'state']
// Should not contain the log entry => which will exist in DB

// logObject
// Should be a collection of objects with expected properties => keys: ['level', 'type', 'typeId', 'time', 'message']
