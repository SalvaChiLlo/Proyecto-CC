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
  REFRESH_RATE: +process.env.REFRESH_RATE * 1000
}

export const config = Object.assign(configEnv, envFile || {})
