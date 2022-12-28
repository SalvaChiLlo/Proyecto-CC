// import Endpoints
import { Request, Response } from 'express';
import { IgnoreJob, Job, JobStatus } from '../models/jobModel';
import { config } from '../config/environment/';
import { consumer, producer } from '../utils/kafka';
import { exit } from 'process';
import * as jwt from 'jsonwebtoken'
import { addDocuments, getJobById, getJobsByUsername, updateJobById as updateJob } from './mongoService'

export async function addJob(req: Request, res: Response) {
  try {
    await producer.connect();
    const newJob: Job = {
      url: req.body.url,
      args: req.body.args,
      config: req.body.config,
      id: Date.now().toString(),
      username: getUsernameFromToken(req)
    };

    // INSERTAR ESTADO TRABAJO
    const jobStatus: JobStatus = {
      id: newJob.id,
      status: config.ESPERA,
      username: getUsernameFromToken(req),
      url: newJob.url,
      config: newJob.config,
      args: newJob.args,
    }
    await addDocuments([jobStatus])

    const messages = [
      { value: JSON.stringify(newJob) }
    ]
    console.log(messages);

    await producer.send({
      topic: 'jobs-queue',
      messages
    });
    res.send(`El id de tu trabajo es: ${newJob.id}`);
    await producer.disconnect();
  } catch (err) {
    console.error(err);
  }
}

export async function checkJobStatus(req: Request, res: Response) {

  const jobStatus = await getJobById(req.params.id);

  if (jobStatus.length === 0) {
    res.send('Trabajo no encontrado. El id es incorrecto.')
  } else {
    res.send(jobStatus[0])
  }
}

export async function showUserJobs(req: Request, res: Response) {
  const token = req.headers.authorization.replace('Bearer ', '')

  const tokenObject: jwt.JwtPayload = jwt.decode(token, { json: true })
  const username: string = tokenObject.preferred_username;

  res.send(await getJobsByUsername(username));
}

function startStatusListener() {
  const run = async () => {
    // Consuming
    await consumer.connect();
    await consumer.subscribe({ topic: 'results-queue', fromBeginning: true });
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
          
          updateJob(jobStatus)
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

function getUsernameFromToken(req: Request): string {
  try {
    const token = req.headers.authorization.replace('Bearer ', '')
    const tokenObject: jwt.JwtPayload = jwt.decode(token, { json: true })
    return tokenObject.preferred_username;
  } catch (error: any) {
    throw new Error("Bearer token incorrecto.")
  }
}

export async function deleteJob(req: Request, res: Response) {  
  try {
    const jobId = req.params.id;
    await producer.connect();

    const deletionRequest: IgnoreJob = {
      id: jobId,
      username: getUsernameFromToken(req)
    }

    const messages = [
      { value: JSON.stringify(deletionRequest) }
    ]
    console.log(messages);

    await producer.send({
      topic: 'ignore-jobs',
      messages
    });

    res.send(`El trabajo ${jobId} ha sido eliminado.`);
    await producer.disconnect();
  } catch (err) {
    console.error(err);
  }
} 