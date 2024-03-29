require('dotenv').config();

module.exports = {
  // Server IP
  ip: process.env.DEVELOPMENT_IP || undefined,

  // Server port
  port: process.env.DEVELOPMENT_PORT || 9000,

  kafka: process.env.DEVELOPMENT_KAFKA_URL?.split(","),

  monogHost: process.env.MONGO_HOST,

  mongoDbName: process.env.MONGO_DATABASE,

  mongoUser: process.env.MONGO_USERNAME,

  mongoPassword: process.env.MONGO_PASSWORD,

  MINIO_URL: process.env.MINIO_URL,
  
  MINIO_PORT: process.env.MINIO_PORT,
  
  MINIO_BUCKET: process.env.MINIO_BUCKET,
  
  MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY,
  
  MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY,

  KEYCLOAK_CLIENT: process.env.KEYCLOAK_CLIENT,

  KEYCLOAK_REALM: process.env.KEYCLOAK_REALM,

  KEYCLOAK_URL: process.env.KEYCLOAK_URL,

  KEYCLOAK_SECRET: process.env.KEYCLOAK_SECRET,
}
