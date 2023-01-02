import * as Minio from 'minio'
import { config } from '../../config/environment'

export const minioClient = new Minio.Client({
  accessKey: config.MINIO_ACCESS_KEY,
  secretKey: config.MINIO_SECRET_KEY,
  endPoint: config.MINIO_URL,
  useSSL: false,
  port: +config.MINIO_PORT
})
