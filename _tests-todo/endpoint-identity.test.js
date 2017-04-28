// identity endpoint
// Should accept identity information from sensor
// Should log any sensor identity
// Should return `pending identity` if sensor is not known
// Should add sensor to DB and set state to `pending` if sensor is not known
// Should emit `sensorlist` to monitors if sensor is not known
// Should return `identified` if sensor is known
// Should set sensor state in DB to `identified` if sensor is known
// Should emit `sensorlist` to monitors if sensor is known
//
// Should accept identity information from monitor
// Should log any monitor identity
// Should return `not authorised` if credentials are incorrect
// Should return `sensorlist` if credentials are correct
