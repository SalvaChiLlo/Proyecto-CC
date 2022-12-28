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
  WORKER_DATA_FOLDER: process.env.WORKER_DATA_FOLDER
}

export const config = Object.assign(configEnv, envFile || {})
