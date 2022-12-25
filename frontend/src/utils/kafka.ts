import { Consumer, Kafka, Partitioners, Producer, logLevel } from "kafkajs";
import { config } from "../config/environment";

const kafka = new Kafka({
  clientId: 'frontend' + Date.now() * Math.random(),
  brokers: config.kafka
})

kafka.logger().setLogLevel(logLevel.ERROR)

export const producer: Producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner })
export const consumer: Consumer = kafka.consumer({ groupId: 'frontend-group' })
