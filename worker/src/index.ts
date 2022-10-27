import { config } from './config/environment/';
import { Consumer } from "kafkajs"
import { Job } from "./Job"

const { Kafka, Partitioners } = require('kafkajs')
import { Producer } from "kafkajs";

const brokers: string[] = [config.kafka];
console.log(brokers);

const kafka = new Kafka({
  clientId: 'worker',
  brokers
})

const producer: Producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner })
const consumer: Consumer = kafka.consumer({ groupId: 'worker-group' })

const run = async () => {
  // Consuming
  await consumer.connect()
  await consumer.subscribe({ topic: 'jobs-queue', fromBeginning: true })

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
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
  await wait(3000);

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