import { config } from "./config/environment";
import { JobStatus, Observation } from "./models/jobModel";
import { getConsumer, kafka, newObservation } from './utils/kafka/kafka';

let jobsStatus: JobStatus[] = [];
let observations: Observation[] = [];

const jobListener = async () => {
  // Consuming
  const consumer = await getConsumer();

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const job: JobStatus = JSON.parse(message.value.toString());
      jobsStatus.push(job)
    },
  })
}
jobListener().catch(console.error)

setInterval(async () => {
  let avgRateOfArrival: number[] = [];
  let avgRateOfService: number[] = [];
  let avgResponseTime: number[] = [];

  jobsStatus.forEach(job => {
    if (job.status === config.ESPERA) {
      avgRateOfArrival.push(+job.arrivalTime)
    }
    if (job.status === config.LANZADO) {
      avgRateOfService.push(+job.serviceTime)
    }
    if (job.status === config.FINALIZADO) {
      avgResponseTime.push(job.elapsedTime)
    }
  })

  const observation: Observation = {
    avgRateOfArrival: avgRateOfArrival.length,
    avgRateOfService: avgRateOfService.length,
    avgRateOfFinished: avgResponseTime.length,
    avgResponseTime: average(avgResponseTime),
    timestamp: Date.now()
  }
  console.log({ observation });


  observations.push(observation)
  newObservation(observation)
  await elasticityStrategy(observation);

  jobsStatus = [];
}, config.REFRESH_RATE)

async function elasticityStrategy(observation: Observation) {
  const pendienteLanzar = observation.avgRateOfArrival - observation.avgRateOfService
  const numWorkers = (await kafka.admin().describeGroups(['worker-group'])).groups[0].members.length
  
  console.log({pendienteLanzar, numWorkers});
  
  if (pendienteLanzar > numWorkers) {
    console.log(`Create ${pendienteLanzar} new Workers`)
  }

  if (numWorkers > 1 && (numWorkers-pendienteLanzar) > 0) {
    console.log(`Delete ${numWorkers-pendienteLanzar} Workers`)
  }
}

function average(numbers: number[]): number {
  const tmp = numbers.reduce((acc, curr) => acc += curr, 0)
  if (numbers.length !== 0) {
    return tmp / numbers.length
  } else {
    return 0
  }
}