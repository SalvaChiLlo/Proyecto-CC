// import Endpoints
import * as jwt from 'jsonwebtoken';
import { exit } from 'process';
import { config } from '../../config/environment';
import { IgnoreJob, Job, JobStatus } from '../../models/jobModel';
import { addJobStatus, consumer, producer } from '../../utils/kafka/kafka';
import { addDocuments, getJobByIdAndUsername, getJobsByUsername, updateJobById as updateJob, updateJobById } from '../../utils/mongo/mongo';

const ERROR_REPO_GIT = "El trabajo debe de tener por lo menos una url a un repositorio git."

export async function addJob(url: any, args: any, jobConfig: any, token: string) {
  let result: string;
  try {
    const newJob: Job = {
      url,
      args,
      config: jobConfig,
      id: Date.now().toString(),
      username: getUsernameFromToken(token)
    };

    // INSERTAR ESTADO TRABAJO
    const jobStatus: JobStatus = {
      id: newJob.id,
      status: config.ESPERA,
      username: getUsernameFromToken(token),
      url: newJob.url,
      config: newJob.config,
      args: newJob.args,
      arrivalTime: newJob.id
    };

    await addJobStatus(jobStatus);
    if (newJob.url === undefined) {
      jobStatus.status = "Fallido"
      await addJobStatus(jobStatus);
      
      throw new Error(ERROR_REPO_GIT)
    }

    const messages = [
      { value: JSON.stringify(newJob) }
    ];
    console.log(messages);
    await producer.connect();
    await producer.send({
      topic: 'jobs-queue',
      messages
    });
    result = `El id de tu trabajo es: ${newJob.id}`;

  } catch (err: any) {
    console.error(err);
    if (err.message === ERROR_REPO_GIT) {
      result = ERROR_REPO_GIT
    } else {
      result = 'Se ha producido un error al intentar crear el trabajo. Inténtalo más tarde'
    }
  } finally {
    return result;
  }
}

export async function checkJobStatus(jobId: string, token: string) {
  const jobStatus = await getJobByIdAndUsername(jobId, getUsernameFromToken(token));

  let message: any = "";
  if (jobStatus.length === 0) {
    message = 'Trabajo no encontrado. El id es incorrecto.';
  } else {
    message = jobStatus[0];
  }
  return message;
}

export async function showUserJobs(token: string) {
  const tokenObject: jwt.JwtPayload = jwt.decode(token, { json: true });
  const username: string = tokenObject.preferred_username;
  return await getJobsByUsername(username);
}

export async function deleteJob(jobId: string, token: string) {
  let message: any;
  try {

    const jobStatus = await getJobByIdAndUsername(jobId, getUsernameFromToken(token));

    if (jobStatus.length !== 0) {

      const deletionRequest: IgnoreJob = {
        id: jobId,
        username: getUsernameFromToken(token)
      };

      const messages = [
        { value: JSON.stringify(deletionRequest) }
      ];
      console.log(messages);

      await producer.connect();

      await producer.send({
        topic: 'ignore-jobs',
        messages
      });

      message = `El trabajo ${jobId} ha sido eliminado.`;
      await producer.disconnect();
    } else {
      message = `El trabajo ${jobId} no existe o no te pertenece.`;
    }

  } catch (err: any) {
    console.error(err);
    message = err.message;
  }
  return message;
}

function startStatusListener() {
  const run = async () => {
    // Consuming
    await consumer.connect();
    await consumer.subscribe({ topic: 'results-queue', fromBeginning: false });
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const jobStatus: JobStatus = JSON.parse(message.value.toString());
          console.log(`
----------------------------------------------------------------
----------------------------------------------------------------
----------------------------------------------------------------

              ${JSON.stringify(jobStatus)}

----------------------------------------------------------------
----------------------------------------------------------------
----------------------------------------------------------------

          `);

          if (jobStatus.status === config.ESPERA) {
            console.log({CREATE: "CREATE"});
            
            addDocuments([jobStatus])
          } else {
            console.log({UPDATE: "UPDATE"});

            updateJob(jobStatus)
          }
        } catch (err) {
          console.error(err);
          exit();
        }
      },
    });
  };
  run().catch(console.error);
}
startStatusListener();

function getUsernameFromToken(token: string): string {
  try {
    token = token.replace('Bearer ', '')
    const tokenObject: jwt.JwtPayload = jwt.decode(token, { json: true })
    return tokenObject.preferred_username;
  } catch (error: any) {
    throw new Error("Bearer token incorrecto.")
  }
}
