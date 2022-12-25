import { Consumer, ConsumerGroupJoinEvent, Kafka, Partitioners, Producer, logLevel } from "kafkajs"
import { config } from "../config/environment"
import { JobStatus } from "../models/jobModel"
import { removeListener } from "process"

export const kafka = new Kafka({
  clientId: 'worker',
  brokers: config.kafka
})

kafka.logger().setLogLevel(logLevel.ERROR)

export let producer: Producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner })
export let consumer: Consumer

export async function getConsumer(topic: string): Promise<Consumer> {
  consumer = kafka.consumer({ groupId: 'worker-group' })

  const consumersCount = (await kafka.admin().describeGroups(['worker-group'])).groups[0].members.length + 1
  let numOfPartitions;
  try {
    numOfPartitions = (await kafka.admin().fetchTopicMetadata({ topics: ['jobs-queue'] })).topics[0].partitions.length
  } catch (error: any) {
    await kafka.admin().createTopics({ topics: [{ topic: topic, numPartitions: 4 }] })
  }
  console.log({ consumersCount, numOfPartitions });

  if (consumersCount > numOfPartitions) {
    console.log("HAY QUE CREAR NUEVAS PARTICIONES");
    try {
      await kafka.admin().createPartitions({ topicPartitions: [{ topic: 'jobs-queue', count: consumersCount }] })
    } catch (err: any) { }
  }

  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: false });
  return consumer;
}

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
