// import Endpoints
import { Request, Response } from "express";
import { Job, JobStatus } from "../models/jobModel";
import { config } from '../config/environment/';
import { consumer, producer } from "../utils/kafka";
import { exit } from "process";

const jobs: any = {};

export async function addJob(req: Request, res: Response) {
  try {
    await producer.connect();
    const newJob: Job = {
      url: req.body.url,
      args: req.body.args,
      config: req.body.config,
      id: Date.now().toString(),
      token: req.headers.authorization
    };

    jobs[newJob.id.toString()] = { id: newJob.id, status: config.ESPERA };

    const messages = [
      { value: JSON.stringify(newJob) }
    ]
    console.log(messages);

    await producer.send({
      topic: 'jobs-queue',
      messages
    });
    res.send(`El id de tu trabajo es: ${newJob.id}`);
  } catch (err) {
    console.error(err);
  }
}

export async function checkJobStatus(req: Request, res: Response) {
  const jobStatus: string = jobs[req.params.id]?.status;

  if (!jobStatus) {
    res.send("Trabajo no encontrado. El id es incorrecto.")
  } else {
    res.send(JSON.stringify(jobs[req.params.id]))
  }
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
          jobs[jobStatus.id] = jobStatus
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

