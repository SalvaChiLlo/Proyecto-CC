import { Request, Response } from "express";
import { minioClient } from "./minioService";
import { lookup } from 'mime-types'

export default async function getFile(req: Request, res: Response) {
  const jobId = req.params.id;
  const file = req.params.file;

  try {
    res.set('Content-disposition', 'attachment; filename=' + file);
    res.set('Content-Type', lookup(file)?.toString());
    res.send((await minioClient.getObject(process.env.MINIO_BUCKET, jobId + '/' + file)).read().toString())

  } catch (err) {
    console.log(err);
    
    res.status(404)
    res.send("El archivo solicitado no se ha encontrado")
  }
}