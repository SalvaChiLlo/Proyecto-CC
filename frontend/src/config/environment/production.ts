require('dotenv').config();

module.exports = {
  // Server IP
  ip: process.env.PRODUCTION_IP || undefined,

  // Server port
  port: process.env.PRODUCTION_PORT || 9000,

  kafka: process.env.PRODUCTION_KAFKA_URL?.split(","),

  monogHost: process.env.MONGO_HOST,

  mongoDbName: process.env.MONGO_DATABASE,

  mongoUser: process.env.MONGO_USERNAME,

  mongoPassword: process.env.MONGO_PASSWORD,
}
