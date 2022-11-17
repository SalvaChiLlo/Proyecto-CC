import * as Minio from 'minio'

export const minioClient = new Minio.Client({
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
  endPoint: process.env.MINIO_URL,
  useSSL: false,
  port: +process.env.MINIO_PORT
})
