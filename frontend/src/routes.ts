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
const jobs: any = {};
const FINALIZADO = "Finalizado"
const LANZADO = "Lanzado"

export function initRoutes(app: Express) {
  startStatusListener();
  serverStatusRoute(app);
  addJob(app);

  app.get('/status/:id', async (req, res) => {
    const jobStatus: string = jobs[req.params.id]?.status;

    if (!jobStatus)
      res.send("Trabajo no encontrado. El id es incorrecto.")
    if (jobStatus == FINALIZADO) {
      res.send("Trabajo Finalizado")
    } else if (jobStatus == LANZADO) {
      res.send("Trabajo Pendiente")
    }
  })

  function handleCatch(error: any) {
    console.log('--------------------------------------------------------------------------')
    console.error(error)
    process.exit(1)
  }
};

function addJob(app: Express) {
  app.post('/addJob', async (req, res) => {
    try {
      await producer.connect();
      const newJob: Job = {
        url: req.body.url,
        id: Date.now().toString()
      };

      jobs[newJob.id.toString()] = { status: LANZADO };

      const metadata: RecordMetadata[] = await producer.send({
        topic: 'jobs-queue',
        messages: [
          { value: JSON.stringify(newJob) }
        ]
      });
      res.send(`El id de tu trabajo es: ${newJob.id}`);
    } catch (err) {
      console.error(err);
    }
  });
}

function startStatusListener() {
  const run = async () => {
    // Consuming
    await consumer.connect();
    await consumer.subscribe({ topic: 'results-queue', fromBeginning: true });
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        jobs[message.value.toString().split(" ")[0]].status = FINALIZADO
      },
    });
  };
  run().catch(console.error);
}

function serverStatusRoute(app: Express) {
  app.get('/', (req: Request, res: Response) => {
    res.status(200).send('<h1>Server is running</h1>');
  });
}