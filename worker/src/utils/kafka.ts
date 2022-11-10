import { Consumer, Kafka, Partitioners, Producer } from "kafkajs"
import { config } from "../config/environment"
import { JobStatus } from "../models/jobModel"

const kafka = new Kafka({
  clientId: 'worker',
  brokers: config.kafka
})

export const producer: Producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner })
export const consumer: Consumer = kafka.consumer({ groupId: 'worker-group' })

export async function updateJobStatus(status: JobStatus) {
  try {
    const messages = [{ value: JSON.stringify(status) }]
  
    await producer.connect()
    await producer.send({
      topic: 'results-queue',
      messages
    })
  } catch (err) {
    console.error(err);
  }
}