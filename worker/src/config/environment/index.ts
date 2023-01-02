require('dotenv').config()
const env = process.env.NODE_ENV || 'development'

let envFile = require('./development')
if (env === 'production') {
  envFile = require('./production')
}

const configEnv = {
  env,
  FINALIZADO: 'Finalizado',
  ESPERA: 'En espera',
  FALLO: 'Fallido',
  LANZADO: 'Lanzado',
  WORKER_DATA_FOLDER: process.env.WORKER_DATA_FOLDER,
  PARTITION_FACTOR: process.env.PARTITION_FACTOR,
  MINIO_URL: process.env.MINIO_URL,
  MINIO_PORT: process.env.MINIO_PORT,
  MINIO_BUCKET: process.env.MINIO_BUCKET,
  MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY,
}

export const config = Object.assign(configEnv, envFile || {})
