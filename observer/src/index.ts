import { JobStatus, Observation } from "./models/jobModel"
import { getConsumer, newObservation } from './utils/kafka';
import { config } from "./config/environment";

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

const smallInterval = 20000;
setInterval(() => {
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
    avgResponseTime: average(avgResponseTime)
  }
  console.log({ observation });


  observations.push(observation)
  newObservation(observation)

  jobsStatus = [];
}, smallInterval)

// const bigInterval = 60000;
// setInterval(() => {
//   const avgRateOfArrival: number[] = [];
//   const avgRateOfService: number[] = [];
//   const avgResponseTime: number[] = [];

//   observations.forEach(obs => {
//     avgRateOfArrival.push(obs.avgRateOfArrival);
//     avgRateOfService.push(obs.avgRateOfService);
//     avgResponseTime.push(obs.avgResponseTime);
//   })

//   const observation: Observation = {
//     avgRateOfArrival: average(avgRateOfArrival),
//     avgRateOfService: average(avgRateOfService),
//     avgResponseTime: average(avgResponseTime)
//   }

//   newObservation(observation)

// }, bigInterval)


function average(numbers: number[]): number {
  const tmp = numbers.reduce((acc, curr) => acc += curr, 0)
  if (numbers.length !== 0) {
    return tmp / numbers.length
  } else {
    return 0
  }
}