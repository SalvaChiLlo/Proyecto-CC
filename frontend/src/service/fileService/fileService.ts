import { config } from "../../config/environment";
import { minioClient } from "../../utils/minio/minio";

export async function getFile(filePath: string): Promise<string> {
  try {
    return (await minioClient.getObject(config.MINIO_BUCKET, filePath)).read().toString();
  } catch (error: any) {    
    throw new Error("El archivo solicitado no se ha encontrado")
  }
}
