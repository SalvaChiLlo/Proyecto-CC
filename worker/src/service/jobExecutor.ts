import { execSync } from "child_process";
import { config } from "../config/environment";
import { Job, JobStatus } from "../models/jobModel";
import { writeFile } from "../utils/files";
import { updateJobStatus } from "../utils/kafka";
import { minioClient } from "./minioService";
import { readdirSync } from 'fs'

export default async function executeJob(job: Job): Promise<JobStatus> {
  let jobStdout: string = "";
  let jobStderr: string = "";
  const projectFolder = `${config.WORKER_DATA_FOLDER}/${job.id}`
  const jobStatus: JobStatus = {
    id: job.id,
    status: config.LANZADO,
    username: job.username,
    url: job.url,
    config: job.config,
    args: job.args,
  }
  await updateJobStatus(jobStatus)
  try {
    // Por prevención eliminamos la carpeta donde se va a crear el proyecto por si por algún casual esta ya existiese.
    execSync(`rm -rf ${projectFolder}`)
    const clone = execSync(`mkdir -p ${config.WORKER_DATA_FOLDER}; cd ${config.WORKER_DATA_FOLDER}; pwd; git clone ${job.url} ${projectFolder};`);
    jobStdout += clone;
    const cd = execSync(`cd ${projectFolder};`)
    jobStdout += cd;
    const mkdirOutput = execSync(`mkdir ${projectFolder}/output`)
    jobStdout += mkdirOutput;
    writeFile(`${projectFolder}/config.json`, job.config.toString());

    const result = execSync(`cd ${projectFolder} && npm run start -- ${job.args}`)
    jobStdout += result;

    jobStatus.status = config.FINALIZADO
  } catch (err: any) {
    jobStderr = err;
    jobStatus.status = config.FALLO
    console.error(jobStderr);
  } finally {
    writeLogs(projectFolder, jobStdout, jobStderr);

    // Guardar ${projectFolder}/output/ en MINIO
    const outputFolder = projectFolder + '/output/';
    const outputFiles = readdirSync(outputFolder);

    console.log(outputFiles);
    jobStatus.outputFiles = outputFiles;
    outputFiles.forEach(async file =>  {
      try {
        await minioClient.fPutObject(process.env.MINIO_BUCKET, job.id + '/' + file, outputFolder + file)
        jobStatus.outputFiles = outputFiles;
      } catch (err: any) {
        throw new Error(err)
      }
    })
 
    return jobStatus;
  }

}

function writeLogs(projectFolder: string, jobStdout: string, jobStderr: string) {
  try {
    writeFile(`${projectFolder}/output/stdout`, jobStdout.toString());
    writeFile(`${projectFolder}/output/stderr`, jobStderr.toString());
  } catch (err: any) {
    console.error(err)
    throw new Error(err)
  }
}
