import { fail } from 'assert';
import { expect } from 'chai';
import { unlinkSync, writeFileSync } from 'fs';
import { config } from '../../config/environment';
import { minioClient } from '../../utils/minio/minio';
import { getFile } from './fileService';

const jobId = Date.now() + "";
const fileName = `prueba${jobId}.txt`;
// Group of tests using describe
describe('File service tests', function () {
  before(async () => {
    try {
      writeFileSync(`./${fileName}`, jobId)
      await minioClient.fPutObject(config.MINIO_BUCKET, `${jobId}/${fileName}`, `./${fileName}`)
    } catch (error: any) {
      console.error("Se ha producido un error en la carga del archivo de prueba");
      throw error;
    }
  })

  it('Pedir un archivo con ruta y nombre válidos', async () => {
    const fileContentFromMinio = await getFile(jobId + '/' + fileName);

    expect(fileContentFromMinio, `El archivo no puede ser null`).to.not.be.null;
    expect(fileContentFromMinio, `El archivo no puede ser undefined`).to.not.be.undefined;
    expect(fileContentFromMinio, `El archivo debería contener: ${jobId}`).to.be.eq(jobId)
  })

  it('Pedir un archivo con nombre no válido', async () => {
    try {
      const fileContentFromMinio = await getFile(jobId + '/' + "incorrecto");
      fail("Esta llamada debería de fallar")
    } catch (error: any) {
      expect(error.message).to.be.eq("El archivo solicitado no se ha encontrado")
    }
  })

  it('Pedir un archivo con jobiD no válido', async () => {
    try {
      const fileContentFromMinio = await getFile(jobId + 1 + '/' + fileName);
      fail("Esta llamada debería de fallar")
    } catch (error: any) {
      expect(error.message).to.be.eq("El archivo solicitado no se ha encontrado")
    }
  })

  after(() => {
    unlinkSync(`./${fileName}`)
  })
})