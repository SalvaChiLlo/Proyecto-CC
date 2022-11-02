import { config } from './config/environment/';
import { Consumer } from "kafkajs"
import { Job } from "./Job"
import { execSync } from 'child_process';

const { Kafka, Partitioners } = require('kafkajs')
import { Producer } from "kafkajs";

console.log(config.kafka);

const kafka = new Kafka({
  clientId: 'worker',
  brokers: config.kafka
})

const producer: Producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner })
const consumer: Consumer = kafka.consumer({ groupId: 'worker-group' })

const run = async () => {
  // Consuming
  await consumer.connect()
  await consumer.subscribe({ topic: 'jobs-queue', fromBeginning: true })

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({ value: message.value, offset: message.offset, partition })
      const job: Job = JSON.parse(message.value.toString());
      await execJob(job, partition);
    },
  })
}
run().catch(console.error)

async function execJob(job: Job, partition: number) {
  // RUN JOB
  console.log(job);
  console.log("Lanzando Trabajo");

  console.log("Ejecutando Trabajo");
  console.log(process.env.WORKER_JOB_RESULTS)
  try {
    const result = execSync(`mkdir -p ${process.env.WORKER_JOB_RESULTS}; cd ${process.env.WORKER_JOB_RESULTS}; pwd; git clone ${job.url} job; cd job; npm run start -- ${job.args}`);
    console.log(result.toString());
  } catch (err: any) {
    console.error(err.output.toString());

  }

  // SEND RESULTS
  console.log("Trabajo Terminado")
  console.log({ value: `${job.id} --> Job Completado` })
  try {
    await producer.connect()
    await producer.send({
      topic: 'results-queue',
      messages: [
        { value: `${job.id} --> Job Completado` },
      ]
    })
  } catch (err) {
    console.error(err);
  }
}


function wait(milliseconds: number) {
  return new Promise(resolve => {
    setTimeout(resolve, milliseconds);
  });
}