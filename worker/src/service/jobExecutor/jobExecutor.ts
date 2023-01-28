import { execSync } from "child_process";
import { readdirSync } from 'fs';
import { config } from "../../config/environment";
import { IgnoreJob, Job, JobStatus } from "../../models/jobModel";
import { writeFile } from "../../utils/files/files";
import { getConsumerDeletedJobs, updateJobStatus } from "../../utils/kafka/kafka";
import { minioClient } from "../../utils/minio/minio";

const jobsToIgnore: IgnoreJob[] = [];

export default async function executeJob(job: Job): Promise<JobStatus> {
  let jobStdout: string = "--- stdout ---\n";
  let jobStderr: string = "--- stderr ---\n";
  const projectFolder = `${config.WORKER_DATA_FOLDER}/${job.id}`
  const tempProjectFolder = `/tmp/std/${job.id}`
  const jobStatus: JobStatus = {
    id: job.id,
    status: config.LANZADO,
    username: job.username,
    serviceTime: Date.now().toString(),
    url: job.url,
    config: job.config,
    args: job.args,
  }
  if (checkIfJobIsDeleted(job)) {
    jobStatus.status = "Eliminado"
    return jobStatus
  }
  await updateJobStatus(jobStatus)
  try {
    // Por prevención eliminamos la carpeta donde se va a crear el proyecto por si por algún casual esta ya existiese.
    execSync(`rm -rf ${projectFolder}`)
    execSync(`rm -rf ${tempProjectFolder}`)
    execSync(`mkdir -p ${tempProjectFolder}/output`)
    const clone = execSync(`mkdir -p ${config.WORKER_DATA_FOLDER}; cd ${config.WORKER_DATA_FOLDER}; pwd; git clone ${job.url} ${projectFolder};`);
    jobStdout += clone;
    const cd = execSync(`cd ${projectFolder};`)
    jobStdout += cd;
    const mkdirOutput = execSync(`mkdir ${projectFolder}/output`)
    jobStdout += mkdirOutput;
    writeFile(`${projectFolder}/config.json`, job.config?.toString());

    const result = execSync(`cd ${projectFolder} && npm run start -- ${job.args}`)
    jobStdout += result;

    jobStatus.status = config.FINALIZADO
  } catch (err: any) {
    jobStderr = err;
    jobStatus.status = config.FALLO
    console.error(jobStderr);
  } finally {
    try {
      writeLogs(tempProjectFolder, jobStdout, jobStderr);
      await uploadOutputFilesToMinio(projectFolder, tempProjectFolder, job, jobStatus);

      jobStatus.responseTime = Date.now().toString();
      execSync(`rm -rf ${projectFolder}`)
    } catch (err: any) { }
    return jobStatus;
  }

}

async function uploadOutputFilesToMinio(projectFolder: string, tempProjectFolder: string, job: Job, jobStatus: JobStatus) {
  console.log("Uploading files");
  console.log("---------------");

  const outputFolder = projectFolder + '/output/';
  const outputFiles = readdirSync(outputFolder);

  const outputFolderTemp = tempProjectFolder + '/output/';
  const outputFilesTemp = readdirSync(outputFolderTemp);

  console.log("Uploading", outputFiles);
  await uploadFilesToMinio(outputFiles, job, outputFolder, jobStatus);

  console.log("Uploading", outputFilesTemp);
  await uploadFilesToMinio(outputFilesTemp, job, outputFolderTemp, jobStatus);

  jobStatus.outputFiles = outputFiles;
  jobStatus.outputFiles.push(...outputFilesTemp);
}

async function uploadFilesToMinio(outputFiles: string[], job: Job, outputFolder: string, jobStatus: JobStatus) {

  await (new Promise((resolve, reject) => {
    if (outputFiles.length == 0) {
      resolve(0);
    }
    outputFiles.forEach(async (file, index, array) => {
      try {
        console.log(file, "-- Uploading");
        await minioClient.fPutObject(process.env.MINIO_BUCKET, job.id + '/' + file, outputFolder + file);
        console.log(file, "-- Uploaded");

        // jobStatus.outputFiles = outputFiles;
      } catch (err: any) {
        throw new Error(err);
      } finally {
        if (index === array.length - 1)
          resolve(0);
      }
    });
  }));
}

function writeLogs(projectFolder: string, jobStdout: string, jobStderr: string) {
  console.log("Writing logs");
  console.log("------------");

  try {
    writeFile(`${projectFolder}/output/stdout.txt`, jobStdout.toString());
    console.log("stdout written")
    writeFile(`${projectFolder}/output/stderr.txt`, jobStderr.toString());
    console.log("stderr written")
  } catch (err: any) {
    console.error(err)
    throw new Error(err)
  }
}

function checkIfJobIsDeleted(job: Job): boolean {
  return jobsToIgnore.filter(ignoredJob => ignoredJob.id === job.id && ignoredJob.username === job.username).length !== 0
}

async function deletedJobsListener() {
  (await getConsumerDeletedJobs()).run({
    eachMessage: async ({ topic, partition, message }) => {
      const ignoreJob: IgnoreJob = JSON.parse(message.value.toString());

      jobsToIgnore.push(ignoreJob);
    },
  })

}
deletedJobsListener()