require('dotenv').config();

module.exports = {
  // Server IP
  ip: process.env.DEVELOPMENT_IP || undefined,

  // Server port
  port: process.env.DEVELOPMENT_PORT || 9000,

  kafka: process.env.DEVELOPMENT_KAFKA_URL
}
