import { Consumer, Kafka, Partitioners, Producer, logLevel } from "kafkajs"
import { config } from "../../config/environment"
import { Observation } from "../../models/jobModel"

export const kafka = new Kafka({
  clientId: 'worker',
  brokers: config.kafka
})

kafka.logger().setLogLevel(logLevel.ERROR)

export let producer: Producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner })
export let consumer: Consumer

export async function getConsumer(): Promise<Consumer> {
  consumer = kafka.consumer({ groupId: 'observer-group' })

  await consumer.connect();
  await consumer.subscribe({ topic: 'results-queue', fromBeginning: false });
  return consumer;
}

export async function newObservation(observation: Observation) {
  try {
    const messages = [{ value: JSON.stringify(observation) }]

    await producer.connect()
    await producer.send({
      topic: 'observer-queue',
      messages
    })
  } catch (err) {
    console.error(err);
  }
}
