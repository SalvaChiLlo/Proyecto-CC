import { Consumer, Kafka, Partitioners, Producer, logLevel } from "kafkajs";
import { config } from "../../config/environment";
import { JobStatus } from "../../models/jobModel";

const kafka = new Kafka({
  clientId: 'frontend' + Date.now() * Math.random(),
  brokers: config.kafka
})

kafka.logger().setLogLevel(logLevel.ERROR)

export const producer: Producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner })
export const consumer: Consumer = kafka.consumer({ groupId: 'frontend-group' })
export const consumerLoad: Consumer = kafka.consumer({ groupId: 'frontend-load-group' })

export async function addJobStatus(jobsStatus: JobStatus) {
  try {
    const messages = [{ value: JSON.stringify(jobsStatus) }]

    await producer.connect()
    await producer.send({
      topic: 'results-queue',
      messages
    })
  } catch (err) {
    console.error(err);
  }
}