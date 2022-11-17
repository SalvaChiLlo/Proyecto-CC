import { Request, Response } from "express";
import { minioClient } from "./minioService";

export default async function getFile(req: Request, res: Response) {
  const jobId = req.params.id;
  const file = req.params.file;

  try {
    await minioClient.fGetObject(process.env.MINIO_BUCKET, jobId + '/' + file, process.env.FRONTEND_DATA_DIR + file)
    res.download(process.env.FRONTEND_DATA_DIR + file)
  } catch(err) {
    res.status(404)
    res.send("El archivo solicitado no se ha encontrado")
  }
}