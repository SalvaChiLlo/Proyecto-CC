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

  MINIO_URL: process.env.MINIO_URL,
  
  MINIO_PORT: process.env.MINIO_PORT,
  
  MINIO_BUCKET: process.env.MINIO_BUCKET,
  
  MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY,
  
  MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY,
}
