import { config } from './config/environment/';
import { Consumer } from "kafkajs"
import { Job } from "./Job"
import { execSync } from 'child_process';
import { writeFileSync } from 'fs'

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
    const rm0 = execSync(`rm -rf ${process.env.WORKER_JOB_RESULTS}/job;`)
    const clone = execSync(`mkdir -p ${process.env.WORKER_JOB_RESULTS}; cd ${process.env.WORKER_JOB_RESULTS}; pwd; git clone ${job.url} job;`);
    console.log("clone", clone.toString())
    const cd = execSync(`cd ${process.env.WORKER_JOB_RESULTS}/job;`)
    console.log("cd", cd.toString())
    console.log(job.config)
    writeFileSync(`${process.env.WORKER_JOB_RESULTS}/job/config.json`, job.config.toString());
    
    const result = execSync(`cd ${process.env.WORKER_JOB_RESULTS}/job && npm install && npm run start -- ${job.args}`)
    const cp = execSync(`cd ${process.env.WORKER_JOB_RESULTS}/job; cp -r output ../${Date.now()}`)
    console.log("cp", cp.toString());

    // const rm = execSync(`rm -rf ${process.env.WORKER_JOB_RESULTS}/job;`)
    // console.log("rm", rm.toString());

    console.log("result", result.toString());
  } catch (err: any) {
    console.error(err);

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