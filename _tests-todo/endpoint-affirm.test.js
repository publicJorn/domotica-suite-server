// affirm endpoint
// Should accept affirmation of alert from monitor
// Should log affirmation (level warn) if monitor is not identified
// Should ignore affirmation if monitor is not identified
// Should log affirmation (level info) if monitor is identified
// Should pass affirmation to sensor if monitor is identified
// Should accept confirmation of affirmation from sensor
// Should set sensor state in DB to `identified` when confirmation of affirmation is received
// Should emit `sensorlist` to monitors
