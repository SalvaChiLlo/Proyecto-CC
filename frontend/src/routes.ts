// import Endpoints
import { Express, Request, Response } from "express";
import { Consumer, Producer, RecordMetadata, Kafka, Partitioners } from "kafkajs";
import { Job } from "./Job"
import { config } from './config/environment/';

console.log(config.kafka);

const kafka = new Kafka({
  clientId: 'frontend' + Date.now() * Math.random(),
  brokers: config.kafka
})
const producer: Producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner })
const consumer: Consumer = kafka.consumer({ groupId: 'frontend-group' })

export function initRoutes(app: Express) {

  const run = async () => {
    // Consuming
    await consumer.connect()
    await consumer.subscribe({ topic: 'results-queue', fromBeginning: true })

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log(message.value.toString())
      },
    })
  }
  run().catch(console.error)

  app.get('/', (req: Request, res: Response) => {
    res.status(200).send('<h1>Server is running</h1>');
  });

  app.post('/addJob', async (req, res) => {
    console.log(req.body);
    // Meter los mensajes en un array y mostrar al usuario "terminado" si existe un registro del trabajo que busca y sino devolver "En ejecución" 
    try {
      await producer.connect()
      const newJob: Job = {
        url: req.body.url,
        id: Date.now().toString()
      }
      const metadata: RecordMetadata[] = await producer.send({
        topic: 'jobs-queue',
        messages: [
          { value: JSON.stringify(newJob) }
        ]
      })
      res.send(`El id de tu trabajo es: ${newJob.id}`);
    } catch (err) {
      console.log(err)
    }
  })

  app.get('/status/:id', async (req, res) => {
    console.log(`-------------${req.params.id}-------------`);


  })

  function handleCatch(error: any) {
    console.log('--------------------------------------------------------------------------')
    console.error(error)
    process.exit(1)
  }
};
